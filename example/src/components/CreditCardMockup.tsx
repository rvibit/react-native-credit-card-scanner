import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CreditCardMockupProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  issuer: string;
}

export const CreditCardMockup: React.FC<CreditCardMockupProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
  issuer,
}) => {
  // Format card number to add spaces every 4 digits if not present
  const formatCardNumber = (number: string) => {
    if (!number) return '•••• •••• •••• ••••';
    const cleanNumber = number.replace(/\s+/g, '');
    const matches = cleanNumber.match(/.{1,4}/g);
    return matches ? matches.join(' ') : '•••• •••• •••• ••••';
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.chip} />
        <Text style={styles.issuerText}>
          {issuer !== 'Unknown' ? issuer : 'Bank Name'}
        </Text>
      </View>

      <Text style={styles.cardNumber}>{formatCardNumber(cardNumber)}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.cardholderContainer}>
          <Text style={styles.label}>Cardholder Name</Text>
          <Text style={styles.value} numberOfLines={1}>
            {cardholderName || 'YOUR NAME'}
          </Text>
        </View>
        <View style={styles.expiryContainer}>
          <Text style={styles.label}>Expiry</Text>
          <Text style={styles.value}>{expiryDate || 'MM/YY'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E1E2C',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    aspectRatio: 1.586, // Standard credit card aspect ratio
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 45,
    height: 30,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    opacity: 0.8,
  },
  issuerText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    opacity: 0.9,
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardholderContainer: {
    flex: 2,
    marginRight: 15,
  },
  expiryContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    color: '#8A8D9F',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  value: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});
