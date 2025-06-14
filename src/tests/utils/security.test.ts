
import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateEventId, sanitizeImageUrl } from '@/utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeInput('<div>Hello</div>')).toBe('Hello');
    });

    it('should remove javascript protocols', () => {
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeInput('JAVASCRIPT:alert("xss")')).toBe('alert("xss")');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should handle normal input correctly', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
    });
  });

  describe('validateEventId', () => {
    it('should accept valid IDs', () => {
      expect(validateEventId('event-123')).toBe(true);
      expect(validateEventId('event_456')).toBe(true);
      expect(validateEventId('abc123')).toBe(true);
    });

    it('should reject invalid IDs', () => {
      expect(validateEventId('')).toBe(false);
      expect(validateEventId('<script>')).toBe(false);
      expect(validateEventId('a'.repeat(51))).toBe(false);
    });
  });

  describe('sanitizeImageUrl', () => {
    it('should return placeholder for empty URLs', () => {
      expect(sanitizeImageUrl('')).toBe('/placeholder.svg');
      expect(sanitizeImageUrl(undefined as any)).toBe('/placeholder.svg');
    });

    it('should allow relative URLs', () => {
      expect(sanitizeImageUrl('/images/test.jpg')).toBe('/images/test.jpg');
    });

    it('should reject invalid URLs', () => {
      expect(sanitizeImageUrl('invalid-url')).toBe('/placeholder.svg');
      expect(sanitizeImageUrl('https://malicious.com/image.jpg')).toBe('/placeholder.svg');
    });

    it('should allow whitelisted domains', () => {
      expect(sanitizeImageUrl('https://images.unsplash.com/photo.jpg')).toBe('https://images.unsplash.com/photo.jpg');
    });
  });
});
