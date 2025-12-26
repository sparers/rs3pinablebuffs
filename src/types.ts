
export interface BuffData {
    name: string;
    image: any;
    threshold?: number;
    path: string;
    abilityCooldown?: number;
    hasAbilityCooldown?: boolean;
    isStack?: boolean;
    isTarget?: boolean;
    useAggressiveSearh?: boolean;
    debug?: boolean;
}

export interface BuffCacheEntry {
    name: string;
    imagePath: string;
    buffDuration: number;
    lastUpdate: number;
    buffProgress: number;
    buffDurationMax: number;
    isPinned: boolean;
    isAudioQueued: boolean;
    abilityCooldown: number;
    abilityCooldownProgress: number;
    abilityCooldownMax: number;
    hasAbilityCooldown: boolean;
    isStack: boolean;
    text: string;
    order: number;
}

export interface PersistedBuff {
    name: string;
    isPinned: boolean;
    isAudioQueued: boolean;
    order?: number;
    imagePath?: string;
    abilityCooldown?: number;
    abilityCooldownProgress?: number;
    abilityCooldownMax?: number;
    hasAbilityCooldown: boolean;
    isStack: boolean;
    text: string;
}

export interface OverlayPosition {
    x: number;
    y: number;
}

export interface OverlaySettings {
    scale: number;
    buffDurationAlertThreshold: number;
    abilityCooldownAlertThreshold: number;
    trackedTargetDebuffs: Record<string, boolean>;
    targetDebuffAudioAlert: boolean;
}