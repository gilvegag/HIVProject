/**
 * Generate a lightweight device fingerprint
 * Non-invasive, privacy-focused
 */

export interface DeviceFingerprintData {
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
}

export function generateDeviceFingerprint(): DeviceFingerprintData {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      language: '',
      timezone: '',
      screenResolution: '',
    };
  }

  return {
    userAgent: navigator.userAgent || '',
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };
}

export function fingerprintToString(data: DeviceFingerprintData): string {
  return `${data.userAgent}-${data.language}-${data.timezone}-${data.screenResolution}`;
}
