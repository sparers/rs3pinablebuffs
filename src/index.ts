import Alpine from 'alpinejs';
import * as a1lib from 'alt1';
import "./appconfig.json";
import cooldownAlert from './audio/long-pop-alert.wav';
import buffCoolDownAlert from './audio/pop-alert.mp3';
import { BuffImageRegistry } from './BuffImageRegistry';
import { BuffManager } from './BuffManager';
import "./icon.png";
import "./index.html";
import { LocalStorageHelper } from './LocalStorageHelper';

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
  lowCooldownAlertedBuffs: new Set<string>(),
  audio: new Audio(buffCoolDownAlert),
  longAudio: new Audio(cooldownAlert),
  activeTab: 'buffs',
  timestamp: null,
  lastUpdate: Date.now(),

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

  setOverlayPosition(group: string) {
    buffManager.setOverlayPosition(group);
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

  isLowBuffCooldown(buff) {
    const isLowBuffCooldown = buff.progress <= 30 && buff.buffCooldown > 0 && buff.buffCooldown <= 60;
    return isLowBuffCooldown;
  },

  isLowCooldown(buff) {
    const isLowCooldown = buff.cooldown <= 5;
    return isLowCooldown;
  },

  checkAndPlayAlerts() {
    this.buffs.forEach(buff => {
      const isLowBuffCooldown = this.isLowBuffCooldown(buff);

      if (isLowBuffCooldown && buff.isPinned && !this.alertedBuffs.has(buff.name)) {
        // Play alert sound
        if (buff.isAudioQueued) {
          this.audio.currentTime = 0;
          this.audio.play().catch(err => console.log('Audio play failed:', err));
        }
        // Mark this buff as alerted
        this.alertedBuffs.add(buff.name);
      } else if (!isLowBuffCooldown && this.alertedBuffs.has(buff.name)) {
        // Remove from alerted set when buff is no longer flashing
        this.alertedBuffs.delete(buff.name);
      }

      const isLowCooldown = this.isLowCooldown(buff);
      if (isLowCooldown && buff.isPinned && !this.lowCooldownAlertedBuffs.has(buff.name)) {
        // Play long alert sound
        if (buff.isAudioQueued) {
          this.longAudio.currentTime = 0;
          this.longAudio.play().catch(err => console.log('Long audio play failed:', err));
        }
        // Mark this buff as alerted
        this.lowCooldownAlertedBuffs.add(buff.name);
      } else if (!isLowCooldown && this.lowCooldownAlertedBuffs.has(buff.name)) {
        this.lowCooldownAlertedBuffs.delete(buff.name);
      }
    });
  },

  isAlerted(buffName: string) {
    const buff = this.buffs.find(b => b.name === buffName);
    console.log(buffName, buff.cooldown);
    if (!buff) return false;
    return this.lowCooldownAlertedBuffs.has(buffName) && buff.cooldown > 0;
  },

  async init() {
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

        await captureElementAsOverlay("buffs-output", BUFFS_OVERLAY_GROUP);
        await captureElementAsOverlay("alerted-buffs", CENTER_OVERLAY_GROUP);
      }
      setTimeout(updateLoop, 150);
    };
    updateLoop();
  }
}));

async function captureElementAsOverlay(elementId: string, overlayGroup: string) {
  const container = document.getElementById(elementId) as HTMLElement;
  if (!container) return;

  const innerHtml = stripAlpine(container.outerHTML);
  const readyToCapture = document.createElement('div');
  readyToCapture.innerHTML = innerHtml;
  readyToCapture.style.position = 'absolute';
  readyToCapture.style.top = '0';
  readyToCapture.style.left = '-9999px';
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

  await buffManager.captureOverlay(overlayGroup, readyToCapture);
  readyToCapture.remove();
}

function stripAlpine(html: string): string {
  return html
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, '')
    .replace(/\s+(x-[a-z:-]+|:[a-z-]+|@[a-z.-]+)(="[^"]*")?/gi, '')
    .replace(/\s+class="settings-section"/gi, '');
}

async function start() {
  await BuffImageRegistry.initialize();
  Alpine.start();
}

start();