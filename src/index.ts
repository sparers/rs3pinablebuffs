import Alpine from 'alpinejs';
import * as a1lib from 'alt1';
import "./appconfig.json";
import clockTicking from './audio/clock-ticking.mp3';
import cooldownAlert from './audio/long-pop-alert.wav';
import { BuffImageRegistry } from './BuffImageRegistry';
import { BuffManager } from './BuffManager';
import "./icon.png";
import "./index.html";
import { LocalStorageHelper } from './LocalStorageHelper';
import { OverlaySettings } from './types';

const storage = new LocalStorageHelper();
const buffManager = new BuffManager(storage);
const BUFFS_OVERLAY_GROUP = 'buffsOverlayGroup';
const CENTER_OVERLAY_GROUP = 'centerOverlayGroup';

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
  draggedIndex: null as number | null,
  isDragging: false,
  resetInprogress: false,
  alertedBuffs: new Set<string>(),
  abilityCooldownAlertedBuffs: new Set<string>(),
  clockTickingAudio: new Audio(clockTicking),
  popAlertAudio: new Audio(cooldownAlert),
  activeTab: 'buffs',
  timestamp: null,
  lastUpdate: Date.now(),
  overlaySettings: {
    scale: 1,
    buffDurationAlertThreshold: 30,
    abilityCooldownAlertThreshold: 5
  },
  overlaySettingsForm: {
    scale: 1,
    buffDurationAlertThreshold: 30,
    abilityCooldownAlertThreshold: 5
  },

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

    buffManager.setOverlayPosition(group, () => {
      // Stop tracking and clear placeholder when position is saved
      this.stopPositionTracking(group, intervalId);
    });
  },


  startPositionTracking(group: string): number {
    const placeholderGroup = `${group}-placeholder`;
    const mousePos = a1lib.getMousePosition();
    // Draw placeholder at mouse position every 100ms
    const intervalId = window.setInterval(() => {
      const mousePos = a1lib.getMousePosition();

      var groupName = '';

      if (group === 'buffsOverlayGroup') {
        groupName = 'Buff/Debuffs';
      } else if (group === 'centerOverlayGroup') {
        groupName = 'Alerts';
      }

      // Clear previous placeholder
      alt1.overLayClearGroup(placeholderGroup);
      alt1.overLaySetGroup(placeholderGroup);

      // Draw text overlay centered inside the rectangle
      alt1.overLayTextEx(
        'Press Alt+1 to set the ' + groupName + ' group position.',
        a1lib.mixColor(255, 255, 255),
        18,
        mousePos.x,
        mousePos.y,
        9999,
        '',
        true,
        true
      );
    }, 100);

    return intervalId;
  },

  stopPositionTracking(group: string, intervalId: number) {
    // Stop the interval
    window.clearInterval(intervalId);

    // Clear the placeholder overlay
    const placeholderGroup = `${group}-placeholder`;
    alt1.overLayClearGroup(placeholderGroup);
  },

  saveOverlaySettings() {
    // Validate and copy form values to actual settings
    this.overlaySettings.scale = Math.max(1, Math.min(3, this.overlaySettingsForm.scale));
    this.overlaySettings.buffDurationAlertThreshold = Math.max(1, Math.min(60, this.overlaySettingsForm.buffDurationAlertThreshold));
    this.overlaySettings.abilityCooldownAlertThreshold = Math.max(1, Math.min(60, this.overlaySettingsForm.abilityCooldownAlertThreshold));

    // Update form with clamped values
    this.overlaySettingsForm.scale = this.overlaySettings.scale;
    this.overlaySettingsForm.buffDurationAlertThreshold = this.overlaySettings.buffDurationAlertThreshold;
    this.overlaySettingsForm.abilityCooldownAlertThreshold = this.overlaySettings.abilityCooldownAlertThreshold;

    storage.save('overlaySettings', this.overlaySettings);
  },

  loadOverlaySettings() {
    const saved = storage.get<OverlaySettings>('overlaySettings');
    if (saved) {
      this.overlaySettings = {
        scale: saved.scale ?? 1,
        buffDurationAlertThreshold: saved.buffDurationAlertThreshold ?? 30,
        abilityCooldownAlertThreshold: saved.abilityCooldownAlertThreshold ?? 5
      };
    } else {
      this.overlaySettings = {
        scale: 1,
        buffDurationAlertThreshold: 30,
        abilityCooldownAlertThreshold: 5
      };
      storage.save('overlaySettings', this.overlaySettings);
    }
    // Copy to form
    this.overlaySettingsForm = { ...this.overlaySettings };
  },

  resetSettings() {
    this.resetInprogress = true;
    storage.clear();
    this.buffs = [];
    this.alertedBuffs.clear();
    location.reload();
    this.resetInprogress = false;
  },

  onDragStart(event: DragEvent, index: number) {
    this.draggedIndex = index;
    this.isDragging = true;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', (event.target as HTMLElement).innerHTML);
    }
    (event.target as HTMLElement).classList.add('dragging');
  },

  onDragEnd(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('dragging');
    this.draggedIndex = null;
    this.isDragging = false;
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
    return this.buffs.some(buff => this.isAlerted(buff.name));
  },

  isLowBuffDuration(buff) {
    if (buff.hasAbilityCooldown) {
      return buff.buffDuration <= 3 && buff.buffDuration > 0;
    }
    return buff.buffDuration <= this.overlaySettings.buffDurationAlertThreshold && buff.buffDuration > 0;
  },

  isLowAbilityCooldown(buff) {
    const isLowAbilityCooldown = buff.abilityCooldown <= this.overlaySettings.abilityCooldownAlertThreshold && buff.abilityCooldown > 0;
    return isLowAbilityCooldown;
  },

  checkAndPlayAlerts() {
    this.buffs.forEach(buff => {
      const isLowBuffDuration = this.isLowBuffDuration(buff);

      if (isLowBuffDuration && buff.isPinned && !this.alertedBuffs.has(buff.name) && !buff.hasAbilityCooldown) {
        // Play alert sound
        if (buff.isAudioQueued) {
          this.clockTickingAudio.currentTime = 0;
          this.clockTickingAudio.play().catch(err => console.log('Audio play failed:', err));
          setTimeout(() => {
            this.clockTickingAudio.pause();
          }, buff.buffDuration * 1000);
        }
        // Mark this buff as alerted
        this.alertedBuffs.add(buff.name);
      } else if (!isLowBuffDuration && this.alertedBuffs.has(buff.name)) {
        // Remove from alerted set when buff is no longer flashing
        this.alertedBuffs.delete(buff.name);
      }

      const isLowAbilityCooldown = this.isLowAbilityCooldown(buff);
      if (isLowAbilityCooldown && buff.isPinned && !this.abilityCooldownAlertedBuffs.has(buff.name)) {
        // Play long alert sound
        if (buff.isAudioQueued) {
          this.popAlertAudio.currentTime = 0;
          this.popAlertAudio.play().catch(err => console.log('Audio play failed:', err));
        }
        // Mark this buff as alerted
        this.abilityCooldownAlertedBuffs.add(buff.name);
      } else if (!isLowAbilityCooldown && this.abilityCooldownAlertedBuffs.has(buff.name)) {
        this.abilityCooldownAlertedBuffs.delete(buff.name);
      }
    });
  },

  isAlerted(buffName: string) {
    const buff = this.buffs.find(b => b.name === buffName);
    //console.log(buffName, buff.abilityCooldown);
    if (!buff) return false;
    return this.abilityCooldownAlertedBuffs.has(buffName) && buff.abilityCooldown > 0;
  },

  async init() {
    this.loadOverlaySettings();
    const updateLoop = async () => {
      // Skip update if user is dragging buffs
      if (!this.isDragging && !this.resetInprogress) {
        const existingBuffs = await buffManager.getActiveBuffs();
        if (existingBuffs) {
          this.buffs = existingBuffs.map(b => ({ ...b }));
          this.checkAndPlayAlerts();
        }

        // Wait for Alpine to update the DOM
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const scale = this.overlaySettings.scale;
        await captureElementAsOverlay("buffs-output", BUFFS_OVERLAY_GROUP, scale);
        await captureElementAsOverlay("alerted-buffs", CENTER_OVERLAY_GROUP, scale);
      }
      setTimeout(updateLoop, 150);
    };
    updateLoop();
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