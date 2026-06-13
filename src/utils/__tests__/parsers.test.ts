import { parseCardData } from '../parsers';

describe('parsers', () => {
  describe('parseCardData', () => {
    it('extracts a standard credit card number', () => {
      const blocks = [
        { blockText: 'Some random text' },
        { blockText: '4242 4242 4242 4242' },
        { blockText: '12/25' },
      ];

      const result = parseCardData(blocks);
      expect(result.cardNumber).toBe('4242424242424242');
      expect(result.expiryDate).toBe('12/25');
    });

    it('extracts a credit card number without spaces', () => {
      const blocks = [{ blockText: '4242424242424242' }];

      const result = parseCardData(blocks);
      expect(result.cardNumber).toBe('4242424242424242');
    });

    it('extracts an expiry date', () => {
      const blocks = [{ blockText: 'Valid Thru' }, { blockText: '05/28' }];

      const result = parseCardData(blocks);
      expect(result.expiryDate).toBe('05/28');
    });

    it('extracts cardholder name', () => {
      const blocks = [
        { blockText: 'VISA' },
        { blockText: 'JOHN DOE' },
        { blockText: '12/25' },
      ];

      const result = parseCardData(blocks);
      expect(result.cardholderName).toBe('JOHN DOE');
    });

    it('ignores card keywords when looking for names', () => {
      const blocks = [
        { blockText: 'CREDIT CARD' },
        { blockText: 'MASTERCARD' },
        { blockText: 'JANE SMITH' },
      ];

      const result = parseCardData(blocks);
      expect(result.cardholderName).toBe('JANE SMITH');
    });
  });
});
