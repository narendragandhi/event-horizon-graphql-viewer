import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { cacheService } from '@/services/cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const testData = { id: 1, name: 'test' };
      cacheService.set('test-key', testData);
      
      const result = cacheService.get('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const result = cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should respect custom TTL', () => {
      const testData = { id: 1, name: 'test' };
      cacheService.set('test-key', testData, 1000); // 1 second TTL
      
      expect(cacheService.get('test-key')).toEqual(testData);
      
      // Fast forward time
      vi.advanceTimersByTime(1001);
      
      expect(cacheService.get('test-key')).toBeNull();
    });

    it('should use default TTL of 5 minutes', () => {
      const testData = { id: 1, name: 'test' };
      cacheService.set('test-key', testData);
      
      // Fast forward 4 minutes
      vi.advanceTimersByTime(4 * 60 * 1000);
      expect(cacheService.get('test-key')).toEqual(testData);
      
      // Fast forward past 5 minutes
      vi.advanceTimersByTime(2 * 60 * 1000);
      expect(cacheService.get('test-key')).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete specific key', () => {
      cacheService.set('test-key', { data: 'test' });
      cacheService.set('other-key', { data: 'other' });
      
      cacheService.delete('test-key');
      
      expect(cacheService.get('test-key')).toBeNull();
      expect(cacheService.get('other-key')).toEqual({ data: 'other' });
    });
  });

  describe('clear', () => {
    it('should clear all cached data', () => {
      cacheService.set('key1', { data: 'test1' });
      cacheService.set('key2', { data: 'test2' });
      
      cacheService.clear();
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });
});
