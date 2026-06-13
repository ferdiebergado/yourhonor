import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from './security';

describe('security', () => {
  // Helper to mock config.appKey if needed for isolated tests
  // For now, we'll rely on the actual key from config

  describe('encrypt', () => {
    it('should produce a Buffer', () => {
      const plaintext = 'hello world';
      const encrypted = encrypt(plaintext);
      expect(encrypted).toBeInstanceOf(Buffer);
    });

    it('should produce different outputs for the same input (due to random IV)', () => {
      const plaintext = 'hello world';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);
      expect(encrypted1).toBeInstanceOf(Buffer);
      expect(encrypted2).toBeInstanceOf(Buffer);
      expect(encrypted1.equals(encrypted2)).toBe(false);
    });

    it('should handle empty string', () => {
      const plaintext = '';
      const encrypted = encrypt(plaintext);
      expect(encrypted).toBeInstanceOf(Buffer);
      // Should be at least IV + authTag in size
      expect(encrypted.length).toBeGreaterThanOrEqual(12 + 16);
    });

    it('should handle long strings', () => {
      const plaintext = 'a'.repeat(10_000);
      const encrypted = encrypt(plaintext);
      expect(encrypted).toBeInstanceOf(Buffer);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('decrypt', () => {
    it('should decrypt what was encrypted', () => {
      const plaintext = 'hello world';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should throw on invalid payload (too short)', () => {
      const shortBuffer = Buffer.from([1, 2, 3]); // Less than IV + authTag
      expect(() => decrypt(shortBuffer)).toThrow('Invalid encrypted payload');
    });

    it('should throw on tampered payload (modified IV)', () => {
      const plaintext = 'hello world';
      const encrypted = encrypt(plaintext);
      // Modify the first byte of IV
      encrypted[0] = encrypted[0] ^ 1;
      expect(() => decrypt(encrypted)).toThrow();
    });

    it('should throw on tampered payload (modified authTag)', () => {
      const plaintext = 'hello world';
      const encrypted = encrypt(plaintext);
      // Modify a byte in the authTag (located after IV)
      encrypted[13] = encrypted[13] ^ 1;
      expect(() => decrypt(encrypted)).toThrow();
    });

    it('should throw on tampered payload (modified ciphertext)', () => {
      const plaintext = 'hello world';
      const encrypted = encrypt(plaintext);
      // Modify a byte in the ciphertext (located after IV + authTag)
      const ciphertextStartIndex = 12 + 16; // IV_LENGTH + AUTH_TAG_LENGTH
      if (encrypted.length > ciphertextStartIndex) {
        encrypted[ciphertextStartIndex] = encrypted[ciphertextStartIndex] ^ 1;
      }
      expect(() => decrypt(encrypted)).toThrow();
    });
  });
});
