export class LocalStorageHelper {
    private readonly prefix: string = 'rs3PinnableBuffs_';

    public save = <T = unknown>(key: string, value: T): boolean => {
        try {
            const serializedValue = typeof value === 'object'
                ? JSON.stringify(value)
                : String(value);
            window.localStorage.setItem(this.prefix + key, serializedValue);
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    };

    public get = <T = unknown>(key: string): T | null => {
        try {
            const value = window.localStorage.getItem(this.prefix + key);
            if (value === null) return null;

            // Try to parse as JSON, fall back to raw string
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as T;
            }
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return null;
        }
    };

    public remove = (key: string): void => {
        window.localStorage.removeItem(this.prefix + key);
    };

    public clear = (): void => {
        const keys = Object.keys(window.localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                window.localStorage.removeItem(key);
            }
        });
    };
}

