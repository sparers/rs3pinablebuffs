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
            if (matchResult.passed >= buffData.threshold) {
              const cooldown = activeBuff.readArg('timearg')?.time || 0;
              currentActiveBuffs.add(buffData.name);

              const existingBuff = this.matchedBuffsCache.get(buffData.name);

              // Determine cooldown and progress based on buff duration
              let newCooldown: number;
              let newProgress: number;
              let newInitialCooldown: number;

              if (cooldown <= 59) {
                // For short buffs, always use game's cooldown
                newCooldown = cooldown;
                newInitialCooldown = existingBuff?.initialCooldown || cooldown;
                newProgress = newInitialCooldown > 0 ? (cooldown / newInitialCooldown) * 100 : 0;
              } else if (!existingBuff || cooldown > existingBuff.cooldown) {
                // For long buffs, only reset if new or cooldown increased
                newCooldown = cooldown;
                newInitialCooldown = cooldown;
                newProgress = 100;
              } else {
                // Keep existing values and let updateCooldowns() tick them down
                newCooldown = existingBuff.cooldown;
                newInitialCooldown = existingBuff.initialCooldown;
                newProgress = existingBuff.progress;
              }

              this.matchedBuffsCache.set(buffData.name, {
                name: buffData.name,
                imagePath: buffData.path,
                cooldown: newCooldown,
                inactive: false,
                lastUpdate: existingBuff?.lastUpdate || Date.now(),
                progress: newProgress,
                initialCooldown: newInitialCooldown,
                isPinned: existingBuff?.isPinned || false,
                order: existingBuff?.order ?? 999
              });
              break;
            }
          }
        }

        // Mark buffs as inactive if they're no longer detected
        Array.from(this.matchedBuffsCache.keys()).forEach(buffName => {
          if (!currentActiveBuffs.has(buffName)) {
            const buff = this.matchedBuffsCache.get(buffName);
            if (buff) {
              buff.inactive = true;
            }
          }
        });
      } else {
        // No active buffs, mark all as inactive
        Array.from(this.matchedBuffsCache.values()).forEach(buff => {
          buff.inactive = true;
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
      if (elapsed > 0 && buff.cooldown > 0) {
        buff.cooldown = Math.max(0, buff.cooldown - elapsed);
        buff.lastUpdate = now;
        if (buff.initialCooldown > 0) {
          buff.progress = Math.max(0, (buff.cooldown / buff.initialCooldown) * 100);
          console.log(buff.progress)
        } else {
          buff.progress = 0;
        }
      }
    });
  };

  private saveCachedBuffs = (): void => {
    const buffsArray: PersistedBuff[] = Array.from(this.matchedBuffsCache.values()).map(buff => ({
      name: buff.name,
      isPinned: buff.isPinned,
      order: buff.order,
      imagePath: buff.imagePath
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
          cooldown: 0,
          inactive: true,
          lastUpdate: Date.now(),
          progress: 0,
          initialCooldown: 0,
          isPinned: buff.isPinned,
          order: buff.order ?? 999
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
