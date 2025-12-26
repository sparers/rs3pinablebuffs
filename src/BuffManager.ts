import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import * as TargetMob from 'alt1/targetmob';
import * as htmlToImage from 'html-to-image';
import { BuffImageRegistry } from './BuffImageRegistry';
import { LocalStorageHelper } from './LocalStorageHelper';
import type { BuffCacheEntry, OverlayPosition, PersistedBuff } from './types';

export class BuffManager {
  private readonly buffs: BuffReader.default;
  private readonly debuffs: BuffReader.default;
  private readonly storage: LocalStorageHelper;
  private readonly targetMob = new TargetMob.default();
  private matchedBuffsCache = new Map<string, BuffCacheEntry>();


  private readonly TRACKED_BUFFS_KEY = 'trackedBuffs';

  constructor(storage: LocalStorageHelper) {
    this.buffs = new BuffReader.default();
    this.debuffs = new BuffReader.default();
    this.debuffs.debuffs = true;
    this.storage = storage;
    this.loadCachedBuffs();
  }

  public getActiveBuffs = async (): Promise<BuffCacheEntry[]> => {
    if (!this.buffs.pos) {
      this.findBuffsAndDebuffs(this.buffs);
    }
    if (!this.debuffs.pos) {
      this.findBuffsAndDebuffs(this.debuffs);
    }
    if (this.buffs.pos || this.debuffs.pos) {
      // First, update cooldowns for all cached buffs
      this.updateCooldowns();

      const activeBuffs = this.buffs.pos ? this.buffs.read() || [] : [];
      const activeDebuffs = this.debuffs.pos ? this.debuffs.read() || [] : [];
      const buffsAndDebuffs = [...activeBuffs, ...activeDebuffs];

      if (buffsAndDebuffs.length > 0) {
        // Track which buffs are currently active
        const currentActiveBuffs = new Set<string>();
        const registeredBuffs = BuffImageRegistry.buffData.filter((buff) => !buff.isTarget);

        for (const activeBuff of buffsAndDebuffs) {
          for (const buffData of registeredBuffs) {
            if (buffData.image == null) continue;
            const matchResult = activeBuff.countMatch(buffData.image, buffData.useAggressiveSearh || false);
            if (buffData.debug) {
              //console.debug(`debug: before check ${buffData.name}:${buffData.threshold} -> passed: ${matchResult.passed}`);
            }

            if (matchResult.passed >= buffData.threshold) {
              const time = activeBuff.readTime();
              const buffText = activeBuff.readArg('arg').arg || '';
              if (buffData.debug) {
                console.debug(`match: ${buffData.name}:${buffData.threshold} -> passed: ${matchResult.passed}`);
                console.debug(`debug: ${buffData.name} -> arg: ${buffText}`);
              }

              currentActiveBuffs.add(buffData.name);

              const existingBuff = this.matchedBuffsCache.get(buffData.name);

              // Determine duration and progress based on buff duration
              let newBuffDuration: number;
              let newText: string;
              let newBuffProgress: number;
              let newBuffDurationMax: number;

              if (buffText.length <= 59) {
                // For short buffs, always use game's duration
                newBuffDuration = time;
                newText = buffText;
                newBuffDurationMax = existingBuff?.buffDurationMax || time;
                newBuffProgress = newBuffDurationMax > 0 ? (time / newBuffDurationMax) * 100 : 0;
              } else if (!existingBuff || time > existingBuff.buffDuration) {
                // For long buffs, only reset if new or duration increased
                newBuffDuration = time;
                newText = buffText;
                newBuffDurationMax = time;
                newBuffProgress = 100;

              } else {
                // Keep existing values and let updateCooldowns() tick them down
                newBuffDuration = existingBuff.buffDuration;
                newText = existingBuff.text;
                newBuffDurationMax = existingBuff.buffDurationMax;
                newBuffProgress = existingBuff.buffProgress;
              }

              // Handle ability cooldown
              let abilityCooldown: number;
              let abilityCooldownMax: number;
              let abilityCooldownProgress: number;

              if (!existingBuff) {
                // Brand new buff - start cooldown immediately
                abilityCooldown = buffData.abilityCooldown;
                abilityCooldownMax = buffData.abilityCooldown;
                abilityCooldownProgress = 100;
              } else if (newBuffProgress === 100 && existingBuff.buffProgress < 100 && buffData.hasAbilityCooldown) {
                // Buff was refreshed (e.g. ability reused or cooldown reset mechanic)
                abilityCooldown = buffData.abilityCooldown;
                abilityCooldownMax = buffData.abilityCooldown;
                abilityCooldownProgress = 100;
              } else if (existingBuff.buffDuration === 0 && buffData.hasAbilityCooldown) {
                // Buff reactivated after expiring - start cooldown fresh if cooldown finished or was never started
                if (existingBuff.abilityCooldown === 0 || existingBuff.abilityCooldownMax === 0) {
                  abilityCooldown = buffData.abilityCooldown;
                  abilityCooldownMax = buffData.abilityCooldown;
                  abilityCooldownProgress = 100;
                } else {
                  // Cooldown still ticking, keep it
                  abilityCooldown = existingBuff.abilityCooldown;
                  abilityCooldownMax = existingBuff.abilityCooldownMax;
                  abilityCooldownProgress = existingBuff.abilityCooldownProgress;
                }
              } else {
                // Buff still active - keep existing cooldown state
                abilityCooldown = existingBuff.abilityCooldown;
                abilityCooldownMax = existingBuff.abilityCooldownMax;
                abilityCooldownProgress = existingBuff.abilityCooldownProgress;
              }

              this.matchedBuffsCache.set(buffData.name, {
                name: buffData.name,
                imagePath: buffData.path,
                buffDuration: newBuffDuration,
                lastUpdate: existingBuff?.lastUpdate || Date.now(),
                buffProgress: newBuffProgress,
                buffDurationMax: newBuffDurationMax,
                isPinned: existingBuff?.isPinned || false,
                isAudioQueued: existingBuff?.isAudioQueued || false,
                order: existingBuff?.order ?? 999,
                abilityCooldown: abilityCooldown,
                abilityCooldownProgress: abilityCooldownProgress,
                abilityCooldownMax: abilityCooldownMax,
                hasAbilityCooldown: buffData.hasAbilityCooldown,
                isStack: buffData.isStack,
                text: newText
              });
              break;
            }
          }
        }

        // Start cooldowns for buffs no longer detected
        Array.from(this.matchedBuffsCache.keys()).forEach(buffName => {
          if (!currentActiveBuffs.has(buffName)) {
            const buff = this.matchedBuffsCache.get(buffName);
            if (buff && buff.buffDuration > 0) {
              // Mark buff as expired
              buff.buffDuration = 0;
              buff.buffProgress = 0;
            }
          }
        });
      } else {
        // No active buffs, expire all
        Array.from(this.matchedBuffsCache.values()).forEach(buff => {
          if (buff.buffDuration > 0) {
            // Mark buff as expired
            buff.buffDuration = 0;
            buff.buffProgress = 0;
          }
        });
      }

      this.saveCachedBuffs();
      const buffsArray = Array.from(this.matchedBuffsCache.values());
      // Sort by pinned status first (pinned on top), then by custom order
      buffsArray.sort((a, b) => {
        // Pinned buffs come first
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        // Within same pinned status, sort by order
        return a.order - b.order;
      });
      return buffsArray;
    }

    return [];
  }

  getTargetDebuffs(trackedTargetDebuffs: Record<string, boolean>) {
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

    // alt1.overLaySetGroup('targetArea');
    // alt1.overLayRect(
    //   a1lib.mixColor(120, 255, 120),
    //   capturedArea.x,
    //   capturedArea.y,
    //   capturedArea.width,
    //   capturedArea.height,
    //   3000,
    //   1
    // );
    // alt1.overLayClearGroup('targetArea');


    const targetDebuffsData = BuffImageRegistry.buffData.filter(buff =>
      buff.isTarget &&
      trackedTargetDebuffs[buff.name.charAt(0).toLowerCase() + buff.name.slice(1).replace(/\s+/g, '')]
    );

    return targetDebuffsData.map(debuff => {
      console.log(debuff.name, debuff.path);
      const isPresent = debuff.image ? capturedArea.findSubimage(debuff.image).length > 0 : false;
      return {
        ...debuff,
        // Use abilityCooldown as a flag: 1 if active, 0 if not
        abilityCooldown: isPresent ? 1 : 0
      };
    });
  }

  private updateCooldowns = (): void => {
    const now = Date.now();
    Array.from(this.matchedBuffsCache.values()).forEach(buff => {
      const elapsed = (now - buff.lastUpdate) / 1000;
      if (elapsed > 0) {
        // Update buff duration
        if (buff.buffDuration > 0) {
          buff.buffDuration = Math.max(0, buff.buffDuration - elapsed);
          if (buff.buffDurationMax > 0) {
            buff.buffProgress = Math.max(0, (buff.buffDuration / buff.buffDurationMax) * 100);
          } else {
            buff.buffProgress = 0;
          }
        }

        // Update ability cooldown
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

  private saveCachedBuffs = (): void => {
    const buffsArray: PersistedBuff[] = Array.from(this.matchedBuffsCache.values()).map(buff => ({
      name: buff.name,
      isPinned: buff.isPinned,
      isAudioQueued: buff.isAudioQueued,
      order: buff.order,
      imagePath: buff.imagePath,
      abilityCooldown: buff.abilityCooldown,
      abilityCooldownProgress: buff.abilityCooldownProgress,
      abilityCooldownMax: buff.abilityCooldownMax,
      hasAbilityCooldown: buff.hasAbilityCooldown,
      isStack: buff.isStack,
      text: buff.text
    }));
    this.storage.save(this.TRACKED_BUFFS_KEY, buffsArray);
  };

  private loadCachedBuffs = (): void => {
    const buffsArray = this.storage.get<PersistedBuff[]>(this.TRACKED_BUFFS_KEY);
    if (buffsArray && Array.isArray(buffsArray)) {
      this.matchedBuffsCache.clear();
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
          hasAbilityCooldown: buff.hasAbilityCooldown,
          isStack: buff.isStack,
          text: buff.text
        });
      });
    }
  };

  public findBuffsAndDebuffs = (buffReader: BuffReader.default): boolean => {
    const buffsFound = buffReader.find();

    if (buffsFound) {
      setTimeout(() => {
        alt1.overLaySetGroup('buffsArea');
        alt1.overLayRect(
          a1lib.mixColor(120, 255, 120),
          this.buffs.getCaptRect().x,
          this.buffs.getCaptRect().y,
          this.buffs.getCaptRect().width,
          this.buffs.getCaptRect().height,
          3000,
          1
        );
      }, 1000);

      setTimeout(() => {
        alt1.overLayClearGroup('buffsArea');
      }, 4000);

      return true;
    }
    return false;
  };

  public setOverlayPosition = (overlayPositionKey: string, onPositionSaved?: () => void): void => {
    //alt1.setTooltip('Press Alt+1 to save position');
    a1lib.once('alt1pressed', () => {
      try {
        const mousePos = a1lib.getMousePosition();
        this.storage.save<OverlayPosition>(overlayPositionKey, {
          x: Math.floor(mousePos.x),
          y: Math.floor(mousePos.y),
        });
        alt1.clearTooltip();

        // Call the callback if provided
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
}
