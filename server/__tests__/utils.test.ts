import { describe, it, expect } from 'vitest';

describe('Basic Utility Tests', () => {
  describe('String utilities', () => {
    it('should handle empty strings', () => {
      const str = '';
      expect(str.length).toBe(0);
    });

    it('should trim whitespace', () => {
      const str = '  test  ';
      expect(str.trim()).toBe('test');
    });
  });

  describe('Array utilities', () => {
    it('should filter arrays correctly', () => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter(n => n > 3);
      expect(filtered).toEqual([4, 5]);
    });

    it('should map arrays correctly', () => {
      const arr = [1, 2, 3];
      const mapped = arr.map(n => n * 2);
      expect(mapped).toEqual([2, 4, 6]);
    });
  });

  describe('Object utilities', () => {
    it('should create objects correctly', () => {
      const obj = { name: 'Test', value: 123 };
      expect(obj.name).toBe('Test');
      expect(obj.value).toBe(123);
    });

    it('should spread objects correctly', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const merged = { ...obj1, ...obj2 };
      expect(merged).toEqual({ a: 1, b: 2 });
    });
  });
});
