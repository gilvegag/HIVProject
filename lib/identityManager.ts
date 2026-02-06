/**
 * Anonymous Identity Manager
 * Handles user ID storage, recovery phrases, and device linking
 */

import { generateDeviceFingerprint, fingerprintToString, type DeviceFingerprintData } from './deviceFingerprint';

const STORAGE_KEYS = {
  USER_ID: 'hiv_support_user_id',
  RECOVERY_PHRASE: 'hiv_support_recovery_phrase',
  DEVICE_FINGERPRINT: 'hiv_support_device_fp',
};

export interface UserIdentity {
  userId: string;
  recoveryPhrase: string;
  deviceFingerprint: string;
  createdAt: number;
}

export class IdentityManager {
  private static instance: IdentityManager;
  private apiUrl: string;

  private constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';
  }

  static getInstance(): IdentityManager {
    if (!IdentityManager.instance) {
      IdentityManager.instance = new IdentityManager();
    }
    return IdentityManager.instance;
  }

  /**
   * Get or create anonymous identity
   */
  async getOrCreateIdentity(): Promise<UserIdentity | null> {
    if (typeof window === 'undefined') return null;

    // Check if user already has an identity
    const existingUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const existingRecoveryPhrase = localStorage.getItem(STORAGE_KEYS.RECOVERY_PHRASE);

    if (existingUserId && existingRecoveryPhrase) {
      const fingerprintData = generateDeviceFingerprint();
      return {
        userId: existingUserId,
        recoveryPhrase: existingRecoveryPhrase,
        deviceFingerprint: fingerprintToString(fingerprintData),
        createdAt: Date.now(),
      };
    }

    // Create new identity
    return this.createNewIdentity();
  }

  /**
   * Create a new anonymous identity
   */
  async createNewIdentity(): Promise<UserIdentity | null> {
    try {
      const fingerprintData = generateDeviceFingerprint();
      const deviceFingerprint = fingerprintToString(fingerprintData);

      const response = await fetch(`${this.apiUrl}/api/identity/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ deviceFingerprint }),
      });

      if (!response.ok) {
        throw new Error('Failed to create identity');
      }

      const data = await response.json();

      // Store locally
      localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId);
      localStorage.setItem(STORAGE_KEYS.RECOVERY_PHRASE, data.recoveryPhrase);
      localStorage.setItem(STORAGE_KEYS.DEVICE_FINGERPRINT, deviceFingerprint);

      return {
        userId: data.userId,
        recoveryPhrase: data.recoveryPhrase,
        deviceFingerprint,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error('Error creating identity:', error);
      return null;
    }
  }

  /**
   * Recover identity with recovery phrase
   */
  async recoverIdentity(recoveryPhrase: string): Promise<UserIdentity | null> {
    try {
      const fingerprintData = generateDeviceFingerprint();
      const deviceFingerprint = fingerprintToString(fingerprintData);

      const response = await fetch(`${this.apiUrl}/api/identity/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recoveryPhrase, deviceFingerprint }),
      });

      if (!response.ok) {
        throw new Error('Invalid recovery phrase');
      }

      const data = await response.json();

      // Store locally
      localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId);
      localStorage.setItem(STORAGE_KEYS.RECOVERY_PHRASE, recoveryPhrase);
      localStorage.setItem(STORAGE_KEYS.DEVICE_FINGERPRINT, deviceFingerprint);

      return {
        userId: data.userId,
        recoveryPhrase,
        deviceFingerprint,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error('Error recovering identity:', error);
      return null;
    }
  }

  /**
   * Get stored recovery phrase
   */
  getRecoveryPhrase(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.RECOVERY_PHRASE);
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  }

  /**
   * Clear identity (logout)
   */
  clearIdentity(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.RECOVERY_PHRASE);
    localStorage.removeItem(STORAGE_KEYS.DEVICE_FINGERPRINT);
  }

  /**
   * Get user trust level
   */
  async getTrustLevel(): Promise<{ trustLevel: number; conversationCount: number; accountAge: number } | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/user/trust`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching trust level:', error);
      return null;
    }
  }
}

export default IdentityManager.getInstance();
