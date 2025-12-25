import type { ImgRef } from 'alt1';

export interface BuffData {
    name: string;
    image: any;
    threshold: number;
    path: string;
    debug?: boolean;
    cooldown: number;
    hasCooldown: boolean;
}

export interface BuffCacheEntry {
    name: string;
    imagePath: string;
    buffCooldown: number;
    lastUpdate: number;
    progress: number;
    initialBuffCooldown: number;
    isPinned: boolean;
    isAudioQueued: boolean;
    cooldown: number;
    cooldownProgress: number;
    initialiCooldown: number;
    hasCooldown: boolean;
    order: number;
}

export interface PersistedBuff {
    name: string;
    isPinned: boolean;
    isAudioQueued: boolean;
    order?: number;
    imagePath?: string;
    cooldown?: number;
    cooldownProgress?: number;
    initialiCooldown?: number;
    hasCooldown: boolean
}

export interface OverlayPosition {
    x: number;
    y: number;
}

export interface OverlaySettings {
    scale: number;
    buffCooldownThreshold: number;
    abilityCooldownThreshold: number;
}

export type ImageCollection = Record<string, ImgRef>;
