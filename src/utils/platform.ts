import { Capacitor } from '@capacitor/core';

/**
 * Detects if the app is running in a native environment (iOS or Android).
 * Returns true if running as a native app, false if running in a regular web browser.
 */
export const isNativeApp = (): boolean => {
    return Capacitor.isNativePlatform();
};
