import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import * as htmlToImage from 'html-to-image';
import { BuffImageRegistry } from './BuffImageRegistry';
import { LocalStorageHelper } from './LocalStorageHelper';
import type { BuffCacheEntry, OverlayPosition, PersistedBuff } from './types';

export class BuffManager {
  private readonly buffs: BuffReader.default;
  private readonly debuffs: BuffReader.default;
  private readonly storage: LocalStorageHelper;
  private matchedBuffsCache = new Map<string, BuffCacheEntry>();

  private readonly OVERLAY_POSITION_KEY = 'overlayPosition';
  private readonly OVERLAY_GROUP = 'overlayGroup';
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
        const registeredBuffs = BuffImageRegistry.buffData;

        for (const activeBuff of buffsAndDebuffs) {
          for (const buffData of registeredBuffs) {
            if (buffData.image == null) continue;
            const matchResult = activeBuff.countMatch(buffData.image, false);
            if (buffData.debug) {
              console.log(`debug: ${buffData.name}:${buffData.threshold} -> passed: ${matchResult.passed}`);
            }

            if (matchResult.passed >= buffData.threshold) {
              const buffCooldown = activeBuff.readArg('timearg')?.time || 0;
              currentActiveBuffs.add(buffData.name);

              const existingBuff = this.matchedBuffsCache.get(buffData.name);

              // Determine cooldown and progress based on buff duration
              let newBuffCooldown: number;
              let newProgress: number;
              let newInitialCooldown: number;

              if (buffCooldown <= 59) {
                // For short buffs, always use game's cooldown
                newBuffCooldown = buffCooldown;
                newInitialCooldown = existingBuff?.initialBuffCooldown || buffCooldown;
                newProgress = newInitialCooldown > 0 ? (buffCooldown / newInitialCooldown) * 100 : 0;
              } else if (!existingBuff || buffCooldown > existingBuff.buffCooldown) {
                // For long buffs, only reset if new or cooldown increased
                newBuffCooldown = buffCooldown;
                newInitialCooldown = buffCooldown;
                newProgress = 100;
              } else {
                // Keep existing values and let updateCooldowns() tick them down
                newBuffCooldown = existingBuff.buffCooldown;
                newInitialCooldown = existingBuff.initialBuffCooldown;
                newProgress = existingBuff.progress;
              }

              // Handle ability cooldown
              let abilityCooldown: number;
              let initialAbilityCooldown: number;
              let abilityCooldownProgress: number;

              if (!existingBuff) {
                // Brand new buff - start cooldown immediately
                abilityCooldown = buffData.cooldown;
                initialAbilityCooldown = buffData.cooldown;
                abilityCooldownProgress = 100;
              } else if (existingBuff.buffCooldown === 0 && buffData.hasCooldown) {
                // Buff reactivated after expiring - start cooldown fresh if cooldown finished or was never started
                if (existingBuff.cooldown === 0 || existingBuff.initialiCooldown === 0) {
                  abilityCooldown = buffData.cooldown;
                  initialAbilityCooldown = buffData.cooldown;
                  abilityCooldownProgress = 100;
                } else {
                  // Cooldown still ticking, keep it
                  abilityCooldown = existingBuff.cooldown;
                  initialAbilityCooldown = existingBuff.initialiCooldown;
                  abilityCooldownProgress = existingBuff.cooldownProgress;
                }
              } else {
                // Buff still active - keep existing cooldown state
                abilityCooldown = existingBuff.cooldown;
                initialAbilityCooldown = existingBuff.initialiCooldown;
                abilityCooldownProgress = existingBuff.cooldownProgress;
              }

              this.matchedBuffsCache.set(buffData.name, {
                name: buffData.name,
                imagePath: buffData.path,
                buffCooldown: newBuffCooldown,
                lastUpdate: existingBuff?.lastUpdate || Date.now(),
                progress: newProgress,
                initialBuffCooldown: newInitialCooldown,
                isPinned: existingBuff?.isPinned || false,
                isAudioQueued: existingBuff?.isAudioQueued || false,
                order: existingBuff?.order ?? 999,
                cooldown: abilityCooldown,
                cooldownProgress: abilityCooldownProgress,
                initialiCooldown: initialAbilityCooldown,
                hasCooldown: buffData.hasCooldown
              });
              break;
            }
          }
        }

        // Start cooldowns for buffs no longer detected
        Array.from(this.matchedBuffsCache.keys()).forEach(buffName => {
          if (!currentActiveBuffs.has(buffName)) {
            const buff = this.matchedBuffsCache.get(buffName);
            if (buff && buff.buffCooldown > 0) {
              // Mark buff as expired
              buff.buffCooldown = 0;
              buff.progress = 0;
            }
          }
        });
      } else {
        // No active buffs, expire all
        Array.from(this.matchedBuffsCache.values()).forEach(buff => {
          if (buff.buffCooldown > 0) {
            // Mark buff as expired
            buff.buffCooldown = 0;
            buff.progress = 0;
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

  private updateCooldowns = (): void => {
    const now = Date.now();
    Array.from(this.matchedBuffsCache.values()).forEach(buff => {
      const elapsed = Math.floor((now - buff.lastUpdate) / 1000);
      if (elapsed > 0) {
        // Update buff duration
        if (buff.buffCooldown > 0) {
          buff.buffCooldown = Math.max(0, buff.buffCooldown - elapsed);
          if (buff.initialBuffCooldown > 0) {
            buff.progress = Math.max(0, (buff.buffCooldown / buff.initialBuffCooldown) * 100);
          } else {
            buff.progress = 0;
          }
        }

        // Update ability cooldown
        if (buff.cooldown > 0) {
          buff.cooldown = Math.max(0, buff.cooldown - elapsed);
          if (buff.initialiCooldown > 0) {
            buff.cooldownProgress = Math.max(0, (buff.cooldown / buff.initialiCooldown) * 100);
          } else {
            buff.cooldownProgress = 0;
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
      cooldown: buff.cooldown,
      cooldownProgress: buff.cooldownProgress,
      initialiCooldown: buff.initialiCooldown,
      hasCooldown: buff.hasCooldown
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
          buffCooldown: 0,
          lastUpdate: Date.now(),
          progress: 0,
          initialBuffCooldown: 0,
          isPinned: buff.isPinned,
          isAudioQueued: buff.isAudioQueued,
          cooldown: buff.cooldown || 0,
          cooldownProgress: buff.cooldownProgress || 0,
          initialiCooldown: buff.initialiCooldown || 0,
          order: buff.order ?? 999,
          hasCooldown: buff.hasCooldown
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

  public setOverlayPosition = (): void => {
    alt1.setTooltip('Press Alt+1 to save position');
    a1lib.once('alt1pressed', () => {
      try {
        const mousePos = a1lib.getMousePosition();
        this.storage.save<OverlayPosition>(this.OVERLAY_POSITION_KEY, {
          x: Math.floor(mousePos.x),
          y: Math.floor(mousePos.y),
        });
        alt1.clearTooltip();
      } catch (error) {
        console.error(error);
      }
    });
  };

  public captureOverlay = async (element: HTMLElement): Promise<void> => {
    try {
      const filter = (node: Element): boolean => {
        return !node.classList?.contains('exclude-me');
      };

      const dataUrl = await htmlToImage.toCanvas(element, {
        width: 250,
        height: 1000,
        quality: 1,
        pixelRatio: 1.5,
        skipAutoScale: false,
        imagePlaceholder: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23ddd"/><text x="16" y="16" text-anchor="middle" dy=".3em" font-size="10" fill="%23999">?</text></svg>',
        filter: filter,
        style: {
          transform: 'none',
          left: '0',
          top: '0',
          position: 'static'
        }
      });

      const overlayPosition = this.storage.get<OverlayPosition>(this.OVERLAY_POSITION_KEY);
      if (!overlayPosition) return;

      const base64ImageString = dataUrl.getContext('2d')!.getImageData(0, 0, dataUrl.width, dataUrl.height);

      alt1.overLaySetGroup(this.OVERLAY_GROUP);
      alt1.overLayFreezeGroup(this.OVERLAY_GROUP);
      alt1.overLayClearGroup(this.OVERLAY_GROUP);
      alt1.overLayImage(
        overlayPosition.x,
        overlayPosition.y,
        a1lib.encodeImageString(base64ImageString),
        base64ImageString.width,
        150
      );
      alt1.overLayRefreshGroup(this.OVERLAY_GROUP);
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
