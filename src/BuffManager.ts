import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import * as TargetMob from 'alt1/targetmob';
import * as htmlToImage from 'html-to-image';
import { BuffImageRegistry } from './BuffImageRegistry';
import { LocalStorageHelper } from './LocalStorageHelper';
import type { BuffCacheEntry, BuffData, OverlayPosition, PersistedBuff } from './types';

type Alt1Buff = NonNullable<ReturnType<BuffReader.default['read']>>[number];

export class BuffManager {
  private readonly buffs: BuffReader.default;
  private readonly debuffs: BuffReader.default;
  private readonly storage: LocalStorageHelper;
  private readonly targetMob = new TargetMob.default();
  private readonly matchedBuffsCache = new Map<string, BuffCacheEntry>();
  private readonly TRACKED_BUFFS_KEY_PREFIX = 'profile_';
  private readonly TRACKED_BUFFS_KEY_SUFFIX = '_trackedBuffs';
  private readonly SETTINGS_KEY_SUFFIX = '_overlaySettings';
  private readonly ACTIVE_PROFILE = 'activeProfile';
  private activeProfile: string = 'default';

  constructor(storage: LocalStorageHelper) {
    this.buffs = new BuffReader.default();
    this.debuffs = new BuffReader.default();
    this.debuffs.debuffs = true;
    this.storage = storage;
    this.loadCachedBuffs();
  }

  public getActiveProfile = () => {
    this.activeProfile = this.storage.get<string>(this.ACTIVE_PROFILE).toString() || 'default';
    return this.activeProfile;
  };

  public setActiveProfile = (profileName: string) => {
    this.activeProfile = profileName;
    this.storage.save<string>(this.ACTIVE_PROFILE, profileName);
    this.loadCachedBuffs();
  };

  public getProfiles = (): string[] => {
    const profiles = new Set<string>(['default']);
    const keys = Object.keys(window.localStorage);
    const prefix = 'rs3PinnableBuffs_' + this.TRACKED_BUFFS_KEY_PREFIX;
    keys.forEach(key => {
      if (key.startsWith(prefix) && key.endsWith(this.TRACKED_BUFFS_KEY_SUFFIX)) {
        const profileName = key.substring(prefix.length, key.length - this.TRACKED_BUFFS_KEY_SUFFIX.length);
        if (profileName) {
          profiles.add(profileName);
        }
      }
    });
    return Array.from(profiles);
  };

  public deleteProfile = (profileName: string) => {
    if (profileName === 'default') return;
    this.storage.remove(this.TRACKED_BUFFS_KEY_PREFIX + profileName + this.TRACKED_BUFFS_KEY_SUFFIX);
    this.storage.remove(this.TRACKED_BUFFS_KEY_PREFIX + profileName + this.SETTINGS_KEY_SUFFIX);
    this.storage.remove(this.TRACKED_BUFFS_KEY_PREFIX + profileName + '_buffsOverlayGroup');
    this.storage.remove(this.TRACKED_BUFFS_KEY_PREFIX + profileName + '_centerOverlayGroup');
  };

  public getTrackedBuffsKey = () => this.TRACKED_BUFFS_KEY_PREFIX + this.activeProfile + this.TRACKED_BUFFS_KEY_SUFFIX;

  public getSettingsKey = () => this.TRACKED_BUFFS_KEY_PREFIX + this.activeProfile + this.SETTINGS_KEY_SUFFIX;

  public getProfileKey = (baseKey: string) => this.TRACKED_BUFFS_KEY_PREFIX + this.activeProfile + '_' + baseKey;

  public getActiveBuffs = async (): Promise<BuffCacheEntry[]> => {
    this.ensureReaderPosition(this.buffs);
    this.ensureReaderPosition(this.debuffs);

    if (!this.buffs.pos && !this.debuffs.pos) {
      return [];
    }

    this.updateCooldowns();

    const activeEntries = this.readActiveEntries();
    if (activeEntries.length === 0) {
      this.expireAllCachedBuffs();
      this.saveCachedBuffs();
      return this.getSortedCachedBuffs();
    }

    const registeredBuffs = this.getRegisteredBuffs();
    const currentActiveBuffs = new Set<string>();

    this.applyBuffMatches(activeEntries, registeredBuffs, currentActiveBuffs);
    this.expireMissingBuffs(currentActiveBuffs);

    this.saveCachedBuffs();
    return this.getSortedCachedBuffs();
  };

  public getTargetDebuffs = (trackedTargetDebuffs: Record<string, boolean>) => {
    const hasTarget = this.targetMob.read();

    if (!hasTarget) {
      return [];
    }

    const targetPos = this.targetMob.lastpos;
    if (!targetPos) {
      return [];
    }

    const targetLocation = {
      x: targetPos.x - 120,
      y: targetPos.y + 25,
      w: 150,
      h: 60,
    };

    const capturedArea = a1lib.captureHold(
      targetLocation.x,
      targetLocation.y,
      targetLocation.w,
      targetLocation.h
    );

    const targetDebuffsData = BuffImageRegistry.buffData.filter(buff =>
      buff.isTarget &&
      trackedTargetDebuffs[buff.name.charAt(0).toLowerCase() + buff.name.slice(1).replace(/\s+/g, '')]
    );

    return targetDebuffsData.map(debuff => {
      const isPresent = debuff.image ? capturedArea.findSubimage(debuff.image).length > 0 : false;
      return {
        ...debuff,
        abilityCooldown: isPresent ? 1 : 0
      };
    });
  }

  public setOverlayPosition = (overlayPositionKey: string, onPositionSaved?: () => void): void => {
    a1lib.once('alt1pressed', () => {
      try {
        const mousePos = a1lib.getMousePosition();
        this.storage.save<OverlayPosition>(overlayPositionKey, {
          x: Math.floor(mousePos.x),
          y: Math.floor(mousePos.y),
        });

        if (onPositionSaved) {
          onPositionSaved();
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  public captureOverlay = async (group: string, element: HTMLElement, scale: number): Promise<void> => {
    try {
      const style = getComputedStyle(element);
      const dataUrl = await htmlToImage.toCanvas(element, {
        width: parseInt(style.width) || 1,
        height: parseInt(style.height) || 1,
        quality: 1,
        pixelRatio: scale,
        imagePlaceholder: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23ddd"/><text x="16" y="16" text-anchor="middle" dy=".3em" font-size="10" fill="%23999">?</text></svg>',
        style: {
          transform: 'none',
          left: '0',
          top: '0',
          position: 'static'
        }
      });

      const overlayPosition = this.storage.get<OverlayPosition>(group);
      if (!overlayPosition) return;

      const base64ImageString = dataUrl.getContext('2d')!.getImageData(0, 0, dataUrl.width, dataUrl.height);

      alt1.overLaySetGroup(group);
      alt1.overLayFreezeGroup(group);
      alt1.overLayClearGroup(group);
      alt1.overLayImage(
        overlayPosition.x,
        overlayPosition.y,
        a1lib.encodeImageString(base64ImageString),
        base64ImageString.width,
        150
      );
      alt1.overLayRefreshGroup(group);
    } catch (e) {
      console.error(e);
    }
  };

  public toggleBuffPin = (buffName: string): void => {
    const buff = this.matchedBuffsCache.get(buffName);
    if (buff) {
      buff.isPinned = !buff.isPinned;
      this.saveCachedBuffs();
    }
  };

  public toggleBuffAudioQueue = (buffName: string): void => {
    const buff = this.matchedBuffsCache.get(buffName);
    if (buff) {
      buff.isAudioQueued = !buff.isAudioQueued;
      this.saveCachedBuffs();
    }
  };

  public saveBuffOrder = (buffs: BuffCacheEntry[]): void => {
    buffs.forEach((buff, index) => {
      const cachedBuff = this.matchedBuffsCache.get(buff.name);
      if (cachedBuff) {
        cachedBuff.order = index;
      }
    });
    this.saveCachedBuffs();
  };

  private ensureReaderPosition = (reader: BuffReader.default): void => {
    if (!reader.pos) {
      this.findBuffsAndDebuffs(reader);
    }
  }

  private readActiveEntries = (): Alt1Buff[] => {
    const activeBuffs = this.buffs.pos ? this.buffs.read() ?? [] : [];
    const activeDebuffs = this.debuffs.pos ? this.debuffs.read() ?? [] : [];
    return [...activeBuffs, ...activeDebuffs];
  }

  private getRegisteredBuffs = (): BuffData[] => {
    return BuffImageRegistry.buffData.filter(buff => !buff.isTarget);
  }

  private applyBuffMatches = (
    activeEntries: Alt1Buff[],
    registeredBuffs: BuffData[],
    currentActiveBuffs: Set<string>
  ): void => {
    for (const activeEntry of activeEntries) {
      for (const buffData of registeredBuffs) {
        if (!buffData.image) {
          continue;
        }

        const matchResult = activeEntry.countMatch(
          buffData.image,
          buffData.useAggressiveSearh || false
        );

        if (buffData.debug) {
          console.debug(`match: ${buffData.name}:${buffData.threshold} -> passed: ${matchResult.passed}`);
        }

        if (matchResult.passed >= buffData.threshold) {
          this.registerMatchedBuff(activeEntry, buffData, currentActiveBuffs, matchResult.passed);
          break;
        }
      }
    }
  }

  private registerMatchedBuff = (
    activeBuff: Alt1Buff,
    buffData: BuffData,
    currentActiveBuffs: Set<string>,
    matchScore: number
  ): void => {
    const detectedDuration = activeBuff.readTime();
    const buffText = activeBuff.readArg('arg').arg || '';

    if (buffData.debug) {
      console.debug(`match: ${buffData.name}:${buffData.threshold} -> passed: ${matchScore}`);
      console.debug(`debug: ${buffData.name} -> arg: ${buffText}`);
    }

    currentActiveBuffs.add(buffData.name);

    const existingBuff = this.matchedBuffsCache.get(buffData.name);
    const durationState = this.calculateDurationState(buffText, detectedDuration, existingBuff);
    const cooldownState = this.calculateCooldownState(existingBuff, buffData, durationState.buffProgress);

    this.matchedBuffsCache.set(buffData.name, {
      name: buffData.name,
      imagePath: buffData.path,
      buffDuration: durationState.buffDuration,
      lastUpdate: Date.now(),
      buffProgress: durationState.buffProgress,
      buffDurationMax: durationState.buffDurationMax,
      isPinned: existingBuff?.isPinned ?? false,
      isAudioQueued: existingBuff?.isAudioQueued ?? false,
      order: existingBuff?.order ?? 999,
      abilityCooldown: cooldownState.abilityCooldown,
      abilityCooldownProgress: cooldownState.abilityCooldownProgress,
      abilityCooldownMax: cooldownState.abilityCooldownMax,
      isStack: !!buffData.isStack,
      text: durationState.text
    });
  }

  private calculateDurationState = (
    buffText: string,
    detectedDuration: number,
    existingBuff?: BuffCacheEntry
  ): { buffDuration: number; buffDurationMax: number; buffProgress: number; text: string } => {
    if (detectedDuration <= 59) {
      let buffDurationMax = existingBuff?.buffDurationMax ?? detectedDuration;
      if (buffDurationMax <= 0 && detectedDuration > 0) {
        buffDurationMax = detectedDuration;
      }
      const buffProgress = buffDurationMax > 0 ? (detectedDuration / buffDurationMax) * 100 : 0;

      return {
        buffDuration: detectedDuration,
        buffDurationMax,
        buffProgress,
        text: buffText
      };
    }

    if (!existingBuff || detectedDuration > existingBuff.buffDuration) {
      return {
        buffDuration: detectedDuration,
        buffDurationMax: detectedDuration,
        buffProgress: 100,
        text: buffText
      };
    }

    return {
      buffDuration: existingBuff.buffDuration,
      buffDurationMax: existingBuff.buffDurationMax,
      buffProgress: existingBuff.buffProgress,
      text: existingBuff.text
    };
  }

  private calculateCooldownState = (
    existingBuff: BuffCacheEntry | undefined,
    buffData: BuffData,
    newBuffProgress: number
  ): { abilityCooldown: number; abilityCooldownMax: number; abilityCooldownProgress: number } => {
    const hasCooldown = !!buffData.abilityCooldown;
    const initialCooldown = hasCooldown ? buffData.abilityCooldown ?? 0 : 0;

    if (!existingBuff) {
      return {
        abilityCooldown: initialCooldown,
        abilityCooldownMax: hasCooldown ? initialCooldown : 0,
        abilityCooldownProgress: hasCooldown && initialCooldown > 0 ? 100 : 0
      };
    }

    if (!hasCooldown) {
      return {
        abilityCooldown: existingBuff.abilityCooldown ?? 0,
        abilityCooldownMax: existingBuff.abilityCooldownMax ?? 0,
        abilityCooldownProgress: existingBuff.abilityCooldownProgress ?? 0
      };
    }

    if (newBuffProgress === 100 && existingBuff.buffProgress < 100) {
      return {
        abilityCooldown: initialCooldown,
        abilityCooldownMax: initialCooldown,
        abilityCooldownProgress: 100
      };
    }

    if (existingBuff.buffDuration === 0) {
      if (existingBuff.abilityCooldown === 0 || existingBuff.abilityCooldownMax === 0) {
        return {
          abilityCooldown: initialCooldown,
          abilityCooldownMax: initialCooldown,
          abilityCooldownProgress: 100
        };
      }

      return {
        abilityCooldown: existingBuff.abilityCooldown,
        abilityCooldownMax: existingBuff.abilityCooldownMax,
        abilityCooldownProgress: existingBuff.abilityCooldownProgress
      };
    }

    return {
      abilityCooldown: existingBuff.abilityCooldown,
      abilityCooldownMax: existingBuff.abilityCooldownMax,
      abilityCooldownProgress: existingBuff.abilityCooldownProgress
    };
  }

  private expireMissingBuffs = (currentActiveBuffs: Set<string>): void => {
    this.matchedBuffsCache.forEach((buff, buffName) => {
      if (!currentActiveBuffs.has(buffName)) {
        this.expireBuff(buff);
      }
    });
  }

  private expireAllCachedBuffs = (): void => {
    this.matchedBuffsCache.forEach(buff => {
      this.expireBuff(buff);
    });
  }

  private expireBuff = (buff: BuffCacheEntry): void => {
    buff.buffDuration = 0;
    buff.buffDurationMax = 0;
    buff.buffProgress = 0;
    buff.text = '';

    if (!buff.abilityCooldown) {
      buff.abilityCooldown = 0;
      buff.abilityCooldownMax = 0;
      buff.abilityCooldownProgress = 0;
    }

    buff.lastUpdate = Date.now();
  }

  private getSortedCachedBuffs = (): BuffCacheEntry[] => {
    const buffsArray = Array.from(this.matchedBuffsCache.values());
    buffsArray.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      return a.order - b.order;
    });
    return buffsArray;
  }

  private updateCooldowns = (): void => {
    const now = Date.now();
    this.matchedBuffsCache.forEach(buff => {
      const elapsed = (now - buff.lastUpdate) / 1000;
      if (elapsed > 0) {
        if (buff.buffDuration > 0) {
          buff.buffDuration = Math.max(0, buff.buffDuration - elapsed);
          if (buff.buffDurationMax > 0) {
            buff.buffProgress = Math.max(0, (buff.buffDuration / buff.buffDurationMax) * 100);
          } else {
            buff.buffProgress = 0;
          }
        }

        if (buff.abilityCooldown > 0) {
          buff.abilityCooldown = Math.max(0, buff.abilityCooldown - elapsed);
          if (buff.abilityCooldownMax > 0) {
            buff.abilityCooldownProgress = Math.max(0, (buff.abilityCooldown / buff.abilityCooldownMax) * 100);
          } else {
            buff.abilityCooldownProgress = 0;
          }
        }

        buff.lastUpdate = now;
      }
    });
  };

  public saveCachedBuffs = (): void => {
    const buffsArray: PersistedBuff[] = Array.from(this.matchedBuffsCache.values()).map(buff => ({
      name: buff.name,
      isPinned: buff.isPinned,
      isAudioQueued: buff.isAudioQueued,
      order: buff.order,
      imagePath: buff.imagePath,
      abilityCooldown: buff.abilityCooldown,
      abilityCooldownProgress: buff.abilityCooldownProgress,
      abilityCooldownMax: buff.abilityCooldownMax,
      isStack: buff.isStack,
      text: buff.text
    }));
    this.storage.save(this.getTrackedBuffsKey(), buffsArray);
  };

  private loadCachedBuffs = (): void => {
    const key = this.getTrackedBuffsKey();
    const buffsArray = this.storage.get<PersistedBuff[]>(key);
    this.matchedBuffsCache.clear();
    if (buffsArray && Array.isArray(buffsArray)) {
      buffsArray.forEach(buff => {
        this.matchedBuffsCache.set(buff.name, {
          name: buff.name,
          imagePath: buff.imagePath || '',
          buffDuration: 0,
          lastUpdate: Date.now(),
          buffProgress: 0,
          buffDurationMax: 0,
          isPinned: buff.isPinned,
          isAudioQueued: buff.isAudioQueued,
          abilityCooldown: buff.abilityCooldown || 0,
          abilityCooldownProgress: buff.abilityCooldownProgress || 0,
          abilityCooldownMax: buff.abilityCooldownMax || 0,
          order: buff.order ?? 999,
          isStack: buff.isStack,
          text: buff.text || ''
        });
      });
    }
  };

  private findBuffsAndDebuffs = (buffReader: BuffReader.default): boolean => {
    const buffsFound = buffReader.find();
    if (!buffsFound) return false;
    const area = 'buffsCaptureArea'
    alt1.overLaySetGroup(area);
    alt1.overLayRect(
      a1lib.mixColor(120, 255, 120),
      this.buffs.getCaptRect().x,
      this.buffs.getCaptRect().y,
      this.buffs.getCaptRect().width,
      this.buffs.getCaptRect().height,
      3000,
      1
    );

    setTimeout(() => {
      alt1.overLayClearGroup(area);
    }, 4000);

    return true;
  };
}
