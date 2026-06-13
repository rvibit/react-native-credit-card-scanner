import { type CardResult } from '../types';
import { getCardIssuer } from './validators';

export interface OCRBlock {
  blockText: string;
}

const CARD_KEYWORDS_REGEX =
  /\b(VISA|MASTERCARD|DISCOVER|AMERICAN|EXPRESS|AMEX|RUPAY|MAESTRO|CIRRUS|DEBIT|CREDIT|PREPAID|PLATINUM|GOLD|CLASSIC|SIGNATURE|INFINITE|WORLD|ELITE|BUSINESS|CORPORATE|BANK|CARD|SERVICES|FINANCIAL|TRUST|UNION|FEDERAL|NATIONAL|INTERNATIONAL|GLOBAL|PLUS|REWARDS|CASHBACK|VALID|THRU|FROM|UNTIL|EXPIRES|EXP|DATE|GOOD|MEMBER|SINCE|CVV|CVC|CID|AUTHORIZED|PROPERTY|RETURN|CUSTOMER|SERVICE)\b/i;

function isValidNameLine(text: string) {
  // 1. Clean up whitespace
  const cleanedText = text.trim();

  // 2. Ignore if it contains any numbers (names don't have digits)
  if (/\d/.test(cleanedText)) return false;

  // 3. Ignore if it contains common card boilerplate keywords
  const hasKeywords = CARD_KEYWORDS_REGEX.test(cleanedText);
  if (hasKeywords) return false;

  // 4. Ignore if it's too short to be a full name (e.g., single letters or noise)
  if (cleanedText.length < 4 || cleanedText.length > 30) return false;

  return true;
}

export const parseCardData = (blocks: OCRBlock[]): Partial<CardResult> => {
  'worklet';
  let cardNumber: string | undefined;
  let expiryDate: string | null = null;
  let cardholderName: string | undefined;

  // Potential name block lines
  const potentialNames: string[] = [];

  for (const block of blocks) {
    const text = block.blockText.trim();
    // Normalize string to help with matching
    const normalizedText = text.replace(/[\r\n]+/g, ' ');

    // 1. Extract Card Number
    // Looks for 13 to 19 digits, possibly separated by spaces or dashes
    if (!cardNumber) {
      const cardNumMatch = normalizedText.match(/(?:\d[ -]*?){13,19}/);
      if (cardNumMatch) {
        const potentialNumber = cardNumMatch[0].replace(/\D/g, '');
        if (potentialNumber.length >= 13 && potentialNumber.length <= 19) {
          cardNumber = potentialNumber;
          continue; // Skip further parsing on this block if it's the card number
        }
      }
    }

    // 2. Extract Expiry Date (MM/YY or MM/YYYY)
    if (!expiryDate) {
      const expiryMatch = normalizedText.match(
        /\b(0[1-9]|1[0-2])\s*[\/\-]\s*(\d{2}|\d{4})\b/
      );
      if (expiryMatch) {
        expiryDate = `${expiryMatch[1]}/${expiryMatch[2]}`;
        continue;
      }
    }

    // 3. Name heuristics
    if (isValidNameLine(text)) {
      potentialNames.push(text);
    }
  }

  // Very basic heuristic for name: take the longest block that matches our criteria
  if (potentialNames.length > 0) {
    cardholderName = potentialNames.sort((a, b) => b.length - a.length)[0];
  }
  return {
    cardNumber: cardNumber || '',
    expiryDate,
    cardholderName,
    issuer: cardNumber ? getCardIssuer(cardNumber) : 'Unknown',
  };
};
