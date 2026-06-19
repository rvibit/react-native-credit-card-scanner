import { isValidLuhn, getCardIssuer } from '../validators';
import { describe, it, expect } from '@jest/globals';

describe('validators', () => {
  describe('isValidLuhn', () => {
    it('returns true for valid test numbers', () => {
      expect(isValidLuhn('4242424242424242')).toBe(true);
      expect(isValidLuhn('4242 4242 4242 4242')).toBe(true);
    });

    it('returns false for invalid numbers', () => {
      expect(isValidLuhn('4242424242424241')).toBe(false);
      expect(isValidLuhn('1234')).toBe(false);
      expect(isValidLuhn('')).toBe(false);
    });
  });

  describe('getCardIssuer', () => {
    it('identifies Visa', () => {
      expect(getCardIssuer('4111')).toBe('Visa');
    });

    it('identifies Mastercard', () => {
      expect(getCardIssuer('5100')).toBe('Mastercard');
      expect(getCardIssuer('2221')).toBe('Mastercard');
    });

    it('identifies Amex', () => {
      expect(getCardIssuer('3400')).toBe('Amex');
      expect(getCardIssuer('3700')).toBe('Amex');
    });

    it('identifies Discover', () => {
      expect(getCardIssuer('6011')).toBe('Discover');
    });

    it('returns Unknown for others', () => {
      expect(getCardIssuer('9999')).toBe('Unknown');
    });
  });
});
