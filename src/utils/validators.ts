import { type CardResult } from '../types';

export const isValidLuhn = (cardNumber: string): boolean => {
  'worklet';
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (cleanNumber.length === 0) return false;

  let sum = 0;
  let isEven = false;

  // Loop from right to left
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const getCardIssuer = (cardNumber: string): CardResult['issuer'] => {
  'worklet';
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // 1. VISA – must come before UnionPay (some 4* UnionPay co-brands exist)
  if (/^4/.test(cleanNumber)) return 'Visa';

  // 2. MASTERCARD – 51-55 OR 2221-2720
  if (
    /^5[1-5]/.test(cleanNumber) ||
    /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cleanNumber)
  )
    return 'Mastercard';

  // 3. AMEX
  if (/^3[47]/.test(cleanNumber)) return 'Amex';

  // 4. DINERS CLUB – before JCB (both start with 3)
  if (/^(30[0-5]|3095|36|3[89])/.test(cleanNumber)) return 'Diners Club';

  // 5. JCB – 3528-3589
  if (/^35(2[89]|[3-8]\d)/.test(cleanNumber)) return 'JCB';

  // 6. MIR (Russia)
  if (/^220[0-4]/.test(cleanNumber)) return 'Mir';

  // 7. RUPAY – check before Discover (shares 60/65 prefixes)
  if (
    /^(508|353|356|652[12]|6[0-9]{3}(?=.*81|.*82)|81[0-9]|82[0-9])/.test(
      cleanNumber
    ) ||
    /^(508[0-9]|6521|6522)/.test(cleanNumber) ||
    /^(60[2-9]|81|82)/.test(cleanNumber)
  )
    return 'RuPay';

  // 8. DISCOVER – 6011, 644-649, 65, 622126-622925
  if (
    /^6011/.test(cleanNumber) ||
    /^64[4-9]/.test(cleanNumber) ||
    /^65/.test(cleanNumber) ||
    /^622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(cleanNumber)
  )
    return 'Discover';

  // 9. CHINA UNIONPAY – broad 62 catch (after Discover's 622* check)
  if (/^62/.test(cleanNumber)) return 'UnionPay';

  // 10. MAESTRO
  if (/^(5018|5020|5038|5893|6304|6759|676[1-3])/.test(cleanNumber))
    return 'Maestro';

  // 11. INSTAPAYMENT
  if (/^63[7-9]/.test(cleanNumber)) return 'InstaPayment';

  return 'Unknown';
};
