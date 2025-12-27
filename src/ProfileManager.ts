import { LocalStorageHelper } from './LocalStorageHelper';

export class ProfileManager {
    private readonly storage: LocalStorageHelper;
    private readonly STORAGE_PREFIX = 'rs3PinnableBuffs_';
    private readonly TRACKED_BUFFS_KEY_PREFIX = 'profile_';
    private readonly TRACKED_BUFFS_KEY_SUFFIX = '_trackedBuffs';
    private readonly SETTINGS_KEY_SUFFIX = '_overlaySettings';
    private readonly ACTIVE_PROFILE_KEY = 'activeProfile';
    private activeProfile: string;

    constructor(storage: LocalStorageHelper) {
        this.storage = storage;
        this.activeProfile = this.storage.get<string>(this.ACTIVE_PROFILE_KEY)?.toString() ?? 'default';
    }

    private resolveProfile = (profileName?: string): string => {
        if (profileName) {
            return profileName;
        }
        this.activeProfile = this.storage.get<string>(this.ACTIVE_PROFILE_KEY).toString() ?? this.activeProfile ?? 'default';
        return this.activeProfile;
    };

    public getActiveProfile = (): string => this.resolveProfile();

    public setActiveProfile = (profileName: string): void => {
        this.activeProfile = profileName;
        this.storage.save(this.ACTIVE_PROFILE_KEY, profileName);
    };

    public getProfiles = (): string[] => {
        const profiles = new Set<string>(['default']);
        const prefix = `${this.STORAGE_PREFIX}${this.TRACKED_BUFFS_KEY_PREFIX}`;
        Object.keys(window.localStorage).forEach(key => {
            if (key.startsWith(prefix) && key.endsWith(this.TRACKED_BUFFS_KEY_SUFFIX)) {
                const profileName = key.substring(
                    prefix.length,
                    key.length - this.TRACKED_BUFFS_KEY_SUFFIX.length
                );
                if (profileName) {
                    profiles.add(profileName);
                }
            }
        });
        return Array.from(profiles);
    };

    public deleteProfile = (profileName: string): void => {
        if (profileName === 'default') {
            return;
        }
        this.storage.remove(this.getTrackedBuffsKey(profileName));
        this.storage.remove(this.getOverlaySettingsKey(profileName));
        this.storage.remove(this.getOverlayGroupKey('buffsOverlayGroup', profileName));
        this.storage.remove(this.getOverlayGroupKey('centerOverlayGroup', profileName));
    };

    public getTrackedBuffsKey = (profileName?: string): string =>
        `${this.TRACKED_BUFFS_KEY_PREFIX}${this.resolveProfile(profileName)}${this.TRACKED_BUFFS_KEY_SUFFIX}`;

    public getOverlaySettingsKey = (profileName?: string): string =>
        `${this.TRACKED_BUFFS_KEY_PREFIX}${this.resolveProfile(profileName)}${this.SETTINGS_KEY_SUFFIX}`;

    public getOverlayGroupKey = (groupKey: string, profileName?: string): string =>
        `${this.TRACKED_BUFFS_KEY_PREFIX}${this.resolveProfile(profileName)}_${groupKey}`;
}
