import Alpine from 'alpinejs';
import * as a1lib from 'alt1';
import "./appconfig.json";
import { AsyncLoop } from './AsyncLoop';
import clockTicking from './audio/clock-ticking.mp3';
import cooldownAlert from './audio/long-pop-alert.wav';
import { BuffImageRegistry } from './BuffImageRegistry';
import { BuffManager } from './BuffManager';
import "./icon.png";
import "./index.html";
import { LocalStorageHelper } from './LocalStorageHelper';
import { ProfileManager } from './ProfileManager';
import { TargetManager } from './TargetManager';
import { OverlaySettings } from './types';

const storage = new LocalStorageHelper();
const profileManager = new ProfileManager(storage);
const buffManager = new BuffManager(storage, profileManager);
const targetManager = new TargetManager();
const BUFFS_OVERLAY_GROUP = 'buffsOverlayGroup';
const CENTER_OVERLAY_GROUP = 'centerOverlayGroup';

const OVERLAY_GROUP_LABELS: Record<string, string> = {
  [BUFFS_OVERLAY_GROUP]: 'Buff/Debuffs',
  [CENTER_OVERLAY_GROUP]: 'Alerts'
};

const REFRESH_INTERVAL_MS = 150;
const POSITION_TRACK_INTERVAL_MS = 100;
const SCALE_RANGE = { min: 1, max: 3 };
const ALERT_THRESHOLD_RANGE = { min: 1, max: 60 };

const createDefaultTrackedTargetDebuffs = () => ({
  vulnerability: false,
  deathMark: false,
  bloat: false,
  smokeCloud: false
});

const createDefaultOverlaySettings = (): OverlaySettings => ({
  scale: SCALE_RANGE.min,
  buffDurationAlertThreshold: 10,
  abilityCooldownAlertThreshold: 5,
  trackedTargetDebuffs: createDefaultTrackedTargetDebuffs(),
  targetDebuffAudioAlert: true
});

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const mergeTrackedTargetDebuffs = (source?: Record<string, boolean>) => ({
  ...createDefaultTrackedTargetDebuffs(),
  ...(source ?? {})
});

const playAudioCue = (audio: HTMLAudioElement): void => {
  audio.currentTime = 0;
  audio.play().catch(err => console.log('Audio play failed:', err));
};

const stopAudioAfter = (audio: HTMLAudioElement, delaySeconds: number): void => {
  window.setTimeout(() => audio.pause(), delaySeconds * 1000);
};

const cloneEntries = <T extends object>(entries: T[]): T[] => entries.map(entry => ({ ...entry }));

const waitForNextFrame = () =>
  new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

// Initialize Alt1 app
if (window.alt1) {
  a1lib.identifyApp("./appconfig.json");
  const settings = document.getElementById("settings") as HTMLElement;
  settings.className = "";
} else {
  const output = document.getElementById("output") as HTMLElement;
  output.className = "";
  const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
  output.insertAdjacentHTML("beforeend", `
    Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1
  `);
}

Alpine.data('buffsData', () => ({
  buffs: [],
  targetDebuffs: [],
  stacks: [],
  draggedIndex: null as number | null,
  alertedBuffs: new Set<string>(),
  alertedDebuffs: new Set<string>(),
  abilityCooldownAlertedBuffs: new Set<string>(),
  clockTickingAudio: new Audio(clockTicking),
  popAlertAudio: new Audio(cooldownAlert),
  activeTab: 'buffs',
  lastUpdate: Date.now(),
  isOverlayPositionSet: {
    buffs: false,
    alerts: false
  },
  overlaySettings: createDefaultOverlaySettings(),
  overlaySettingsForm: createDefaultOverlaySettings(),
  activeProfile: 'default',
  profiles: [] as string[],
  newProfileName: '' as string,

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${Math.floor(secs).toString().padStart(2, '0')}`;
  },

  togglePin(buffName: string) {
    // Update local state immediately for instant UI feedback
    const buff = this.buffs.find(b => b.name === buffName);
    if (buff) {
      buff.isPinned = !buff.isPinned;
    }
    // Then update the manager's cache
    buffManager.toggleBuffPin(buffName);
  },

  toggleAudioQueue(buffName: string) {
    // Update local state immediately for instant UI feedback
    const buff = this.buffs.find(b => b.name === buffName);
    if (buff) {
      buff.isAudioQueued = !buff.isAudioQueued;
    }
    // Then update the manager's cache
    buffManager.toggleBuffAudioQueue(buffName);
  },

  async setOverlayPosition(group: string) {
    // Start tracking mouse with placeholder
    const intervalId = this.startPositionTracking(group);

    const profileKey = profileManager.getOverlayGroupKey(group, this.activeProfile);
    buffManager.setOverlayPosition(profileKey, () => {
      // Stop tracking and clear placeholder when position is saved
      this.stopPositionTracking(group, intervalId);
      this.checkOverlayPositions();
    });
  },

  startPositionTracking(group: string): number {
    const placeholderGroup = `${group}-placeholder`;
    const label = OVERLAY_GROUP_LABELS[group] ?? group;

    return window.setInterval(() => {
      const mousePos = a1lib.getMousePosition();

      alt1.overLayClearGroup(placeholderGroup);
      alt1.overLaySetGroup(placeholderGroup);
      alt1.overLayTextEx(
        `Press Alt+1 to set the ${label} group position.`,
        a1lib.mixColor(255, 255, 255),
        18,
        mousePos.x,
        mousePos.y,
        9999,
        '',
        true,
        true
      );
    }, POSITION_TRACK_INTERVAL_MS);
  },

  stopPositionTracking(group: string, intervalId: number) {
    // Stop the interval
    window.clearInterval(intervalId);

    // Clear the placeholder overlay
    const placeholderGroup = `${group}-placeholder`;
    alt1.overLayClearGroup(placeholderGroup);
  },

  saveOverlaySettings() {
    const scale = clamp(this.overlaySettingsForm.scale, SCALE_RANGE.min, SCALE_RANGE.max);
    const buffDuration = clamp(
      this.overlaySettingsForm.buffDurationAlertThreshold,
      ALERT_THRESHOLD_RANGE.min,
      ALERT_THRESHOLD_RANGE.max
    );
    const abilityCooldown = clamp(
      this.overlaySettingsForm.abilityCooldownAlertThreshold,
      ALERT_THRESHOLD_RANGE.min,
      ALERT_THRESHOLD_RANGE.max
    );

    this.overlaySettings = {
      ...this.overlaySettings,
      scale,
      buffDurationAlertThreshold: buffDuration,
      abilityCooldownAlertThreshold: abilityCooldown,
      trackedTargetDebuffs: { ...this.overlaySettingsForm.trackedTargetDebuffs },
      targetDebuffAudioAlert: this.overlaySettingsForm.targetDebuffAudioAlert
    };

    this.overlaySettingsForm = {
      ...this.overlaySettings,
      trackedTargetDebuffs: { ...this.overlaySettings.trackedTargetDebuffs }
    };

    storage.save(profileManager.getOverlaySettingsKey(this.activeProfile), this.overlaySettings);
  },

  loadOverlaySettings() {
    const key = profileManager.getOverlaySettingsKey(this.activeProfile);
    let saved = storage.get<OverlaySettings>(key);
    const defaults = createDefaultOverlaySettings();
    const savedTracked = mergeTrackedTargetDebuffs(saved?.trackedTargetDebuffs);
    const overlaySettings = saved
      ? {
        scale: saved.scale ?? defaults.scale,
        buffDurationAlertThreshold: saved.buffDurationAlertThreshold ?? defaults.buffDurationAlertThreshold,
        abilityCooldownAlertThreshold: saved.abilityCooldownAlertThreshold ?? defaults.abilityCooldownAlertThreshold,
        trackedTargetDebuffs: savedTracked,
        targetDebuffAudioAlert: saved.targetDebuffAudioAlert ?? defaults.targetDebuffAudioAlert
      }
      : defaults;

    this.overlaySettings = {
      ...overlaySettings,
      scale: clamp(overlaySettings.scale, SCALE_RANGE.min, SCALE_RANGE.max),
      buffDurationAlertThreshold: clamp(
        overlaySettings.buffDurationAlertThreshold,
        ALERT_THRESHOLD_RANGE.min,
        ALERT_THRESHOLD_RANGE.max
      ),
      abilityCooldownAlertThreshold: clamp(
        overlaySettings.abilityCooldownAlertThreshold,
        ALERT_THRESHOLD_RANGE.min,
        ALERT_THRESHOLD_RANGE.max
      )
    };

    this.overlaySettingsForm = {
      ...this.overlaySettings,
      trackedTargetDebuffs: { ...this.overlaySettings.trackedTargetDebuffs }
    };

    const hasChanges =
      !saved ||
      saved.scale !== this.overlaySettings.scale ||
      saved.buffDurationAlertThreshold !== this.overlaySettings.buffDurationAlertThreshold ||
      saved.abilityCooldownAlertThreshold !== this.overlaySettings.abilityCooldownAlertThreshold ||
      saved.targetDebuffAudioAlert !== this.overlaySettings.targetDebuffAudioAlert ||
      Object.keys(savedTracked).some(
        key => savedTracked[key] !== this.overlaySettings.trackedTargetDebuffs[key]
      );

    if (hasChanges) {
      storage.save(profileManager.getOverlaySettingsKey(this.activeProfile), this.overlaySettings);
    }
  },

  resetSettings() {
    this.loop.pause();
    storage.clear();
    location.reload();
    this.loop.start();
  },

  loadProfiles() {
    this.profiles = profileManager.getProfiles();
    this.activeProfile = profileManager.getActiveProfile();
  },

  switchProfile(name: string) {
    if (!name) return;
    this.loop.pause();
    const previousProfile = profileManager.getActiveProfile();
    const previousBuffGroup = profileManager.getOverlayGroupKey(BUFFS_OVERLAY_GROUP, previousProfile);
    const previousCenterGroup = profileManager.getOverlayGroupKey(CENTER_OVERLAY_GROUP, previousProfile);

    this.alertedBuffs.clear();
    this.alertedDebuffs.clear();
    this.abilityCooldownAlertedBuffs.clear();
    this.buffs = [];
    this.stacks = [];
    this.targetDebuffs = [];

    alt1.overLayClearGroup(previousBuffGroup);
    alt1.overLayRefreshGroup(previousBuffGroup);
    alt1.overLayClearGroup(previousCenterGroup);
    alt1.overLayRefreshGroup(previousCenterGroup);

    this.activeProfile = name;

    profileManager.setActiveProfile(name);
    buffManager.loadCachedBuffs();
    this.loadOverlaySettings();
    this.checkOverlayPositions();
    this.activeTab = 'buffs';
    this.loop.start();
  },

  createProfile() {
    const name = this.newProfileName.trim();
    if (!name) return;
    this.switchProfile(name);
    buffManager.saveCachedBuffs();
    this.newProfileName = '';
    this.loadProfiles();
  },

  deleteProfile(name: string) {
    if (name === 'default') return;
    profileManager.deleteProfile(name);
    this.loadProfiles();
    this.switchProfile('default');
  },

  checkOverlayPositions() {
    this.isOverlayPositionSet.buffs = !!storage.get(profileManager.getOverlayGroupKey(BUFFS_OVERLAY_GROUP, this.activeProfile));
    this.isOverlayPositionSet.alerts = !!storage.get(profileManager.getOverlayGroupKey(CENTER_OVERLAY_GROUP, this.activeProfile));
  },

  onDragStart(event: DragEvent, index: number) {
    this.loop.pause();
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', (event.target as HTMLElement).innerHTML);
    }
    (event.target as HTMLElement).classList.add('dragging');
  },

  onDragEnd(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('dragging');
    this.draggedIndex = null;
    this.loop.start();
  },

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  },

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      const draggedBuff = this.buffs[this.draggedIndex];
      this.buffs.splice(this.draggedIndex, 1);
      this.buffs.splice(dropIndex, 0, draggedBuff);

      // Update order property for all buffs
      this.buffs.forEach((buff, idx) => {
        buff.order = idx;
      });

      buffManager.saveBuffOrder(this.buffs);
    }
  },
  hasAlertedBuffs() {
    return (
      this.buffs.some(buff => this.isAlerted(buff.name)) ||
      this.targetDebuffs.length > 0 ||
      this.stacks.some(stack => stack.buffDuration > 0)
    );
  },

  isLowBuffDuration(buff) {
    if (buff.abilityCooldown) {
      return buff.buffDuration <= 3 && buff.buffDuration > 0;
    }
    return buff.buffDuration <= this.overlaySettings.buffDurationAlertThreshold && buff.buffDuration > 0;
  },

  isLowAbilityCooldown(buff) {
    return (
      buff.abilityCooldown > 0 &&
      buff.abilityCooldown <= this.overlaySettings.abilityCooldownAlertThreshold
    );
  },

  checkAndPlayAlerts() {
    this.buffs.forEach(buff => {
      const isLowBuffDuration = this.isLowBuffDuration(buff);

      if (isLowBuffDuration && buff.isPinned && !this.alertedBuffs.has(buff.name) && !buff.abilityCooldown && !buff.isStack) {
        // Play alert sound
        if (buff.isAudioQueued) {
          playAudioCue(this.clockTickingAudio);
          stopAudioAfter(this.clockTickingAudio, buff.buffDuration);
        }
        // Mark this buff as alerted
        this.alertedBuffs.add(buff.name);
      } else if (!isLowBuffDuration && this.alertedBuffs.has(buff.name)) {
        // Remove from alerted set when buff is no longer flashing
        this.alertedBuffs.delete(buff.name);
        this.clockTickingAudio.pause();
      }

      const isLowAbilityCooldown = this.isLowAbilityCooldown(buff);
      if (isLowAbilityCooldown && buff.isPinned && !this.abilityCooldownAlertedBuffs.has(buff.name)) {
        // Play long alert sound
        if (buff.isAudioQueued) {
          playAudioCue(this.popAlertAudio);
        }
        // Mark this buff as alerted
        this.abilityCooldownAlertedBuffs.add(buff.name);
      } else if (!isLowAbilityCooldown && this.abilityCooldownAlertedBuffs.has(buff.name)) {
        this.abilityCooldownAlertedBuffs.delete(buff.name);
      }
    });

    this.targetDebuffs.forEach(debuff => {
      if (!this.alertedDebuffs.has(debuff.name) && debuff.abilityCooldown === 0 && this.overlaySettings.targetDebuffAudioAlert) {
        playAudioCue(this.popAlertAudio);
        // Mark this debuff as alerted
        this.alertedDebuffs.add(debuff.name);
      } else if (this.alertedDebuffs.has(debuff.name) && debuff.abilityCooldown === 1) {
        // Remove from alerted set when debuff is no longer flashing
        this.alertedDebuffs.delete(debuff.name);
      }
    });
  },

  isAlerted(buffName: string) {
    const buff = this.buffs.find(b => b.name === buffName);
    if (!buff) return false;
    return this.abilityCooldownAlertedBuffs.has(buffName) && buff.abilityCooldown > 0;
  },

  hasCoolDowns() {
    return this.abilityCooldownAlertedBuffs.size > 0;
  },

  hasStacks() {
    return this.stacks.some(stack => stack.buffDuration > 0);
  },

  async init() {
    this.loadProfiles();
    this.loadOverlaySettings();
    this.checkOverlayPositions();

    const updateLoop = async () => {
      const activeBuffs = await buffManager.getActiveBuffs();
      this.buffs = cloneEntries(activeBuffs.filter(buff => !buff.isStack));
      this.stacks = cloneEntries(activeBuffs.filter(buff => buff.isStack));

      const targetDebuffs = await targetManager.getTargetDebuffs(this.overlaySettings.trackedTargetDebuffs);
      this.targetDebuffs = cloneEntries(targetDebuffs);

      if (activeBuffs.length > 0 || targetDebuffs.length > 0) {
        this.checkAndPlayAlerts();
      }

      await waitForNextFrame();

      const scale = this.overlaySettings.scale;
      await captureElementAsOverlay('buffs-output', profileManager.getOverlayGroupKey(BUFFS_OVERLAY_GROUP, this.activeProfile), scale);
      await captureElementAsOverlay('alerted-buffs', profileManager.getOverlayGroupKey(CENTER_OVERLAY_GROUP, this.activeProfile), scale);
    }

    this.loop = new AsyncLoop(updateLoop, REFRESH_INTERVAL_MS);
    this.loop.start();

  }
}));

async function captureElementAsOverlay(elementId: string, overlayGroup: string, scale: number) {
  const container = document.getElementById(elementId) as HTMLElement;
  if (!container) return;

  const innerHtml = stripAlpine(container.outerHTML);
  const readyToCapture = document.createElement('div');
  readyToCapture.innerHTML = innerHtml;
  readyToCapture.style.position = 'absolute';
  readyToCapture.style.top = '0';
  readyToCapture.style.left = '-9999px';
  readyToCapture.querySelectorAll('.exclude-me').forEach(el => el.remove());


  document.body.appendChild(readyToCapture);

  await Promise.all(
    Array.from(readyToCapture.querySelectorAll('img')).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  await buffManager.captureOverlay(overlayGroup, readyToCapture, scale);
  readyToCapture.remove();
}

function stripAlpine(html: string): string {
  return html
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, '')
    .replace(/\s+(x-[a-z:-]+|:[a-z-]+|@[a-z.-]+)(="[^"]*")?/gi, '')
}

async function start() {
  await BuffImageRegistry.initialize();
  Alpine.start();
}

start();