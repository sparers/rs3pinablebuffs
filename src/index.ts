import Alpine from 'alpinejs';
import * as alt1 from 'alt1';
import "./appconfig.json";
import { BuffImageRegistry } from './BuffImageRegistry';
import { BuffManager } from './BuffManager';
import "./icon.png";
import "./index.html";
import { LocalStorageHelper } from './LocalStorageHelper';

const storage = new LocalStorageHelper();
const buffManager = new BuffManager(storage);

// Initialize Alt1 app
if (window.alt1) {
  alt1.identifyApp("./appconfig.json");
  const settings = document.getElementById("settings") as HTMLElement;
  settings.className = "";
} else {
  const output = document.getElementById("output") as HTMLElement;
  const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
  output.insertAdjacentHTML("beforeend", `
    Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1
  `);
}

Alpine.data('buffsData', () => ({
  buffs: [],
  draggedIndex: null as number | null,
  isDragging: false,

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  setOverlayPosition() {
    buffManager.setOverlayPosition();
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

  async init() {
    const updateLoop = async () => {
      // Skip update if user is dragging buffs
      if (!this.isDragging) {
        const existingBuffs = await buffManager.getActiveBuffs();
        if (existingBuffs) {
          this.buffs = existingBuffs.map(b => ({ ...b }));
        }

        // Wait for Alpine to update the DOM
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const buffContainer = document.getElementById("buffs-output") as HTMLElement;
        const innerHtml = stripAlpine(buffContainer.outerHTML);
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
        await buffManager.captureOverlay(readyToCapture);
        readyToCapture.remove();
      }
      setTimeout(updateLoop, 150);
    };
    updateLoop();
  }
}));

function stripAlpine(html: string): string {
  return html
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, '')
    .replace(/\s+(x-[a-z:-]+|:[a-z-]+|@[a-z.-]+)(="[^"]*")?/gi, '');
}

async function start() {
  await BuffImageRegistry.initialize();
  Alpine.start();
}

start();