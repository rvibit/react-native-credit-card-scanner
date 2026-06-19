import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import { type CardResult } from 'react-native-credit-card-scanner';
import { useCameraPermission } from 'react-native-vision-camera';

import { CreditCardMockup } from '../components/CreditCardMockup';
import { PaymentForm } from '../components/PaymentForm';
import { ScannerModal } from '../components/ScannerModal';

export const ModalExample = (): React.JSX.Element => {
  // State for form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuer, setIssuer] = useState('Unknown');

  // State for scanner modal
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const handleScanSuccess = (result: CardResult) => {
    setIsScannerVisible(false); // Close modal on success

    // Update form fields with scanned data
    if (result.cardNumber) setCardNumber(result.cardNumber);
    if (result.cardholderName) setCardholderName(result.cardholderName);
    if (result.expiryDate) setExpiryDate(result.expiryDate);
    if (result.issuer) setIssuer(result.issuer);
  };

  const handleScanPress = () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to scan cards.'
      );
      requestPermission();
      return;
    }
    setIsScannerVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Checkout (Modal)</Text>
            <Text style={styles.headerSubtitle}>
              Enter your payment details
            </Text>
          </View>

          <CreditCardMockup
            cardNumber={cardNumber}
            cardholderName={cardholderName}
            expiryDate={expiryDate}
            issuer={issuer}
          />

          <PaymentForm
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardholderName={cardholderName}
            setCardholderName={setCardholderName}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            onScanPress={handleScanPress}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ScannerModal
        visible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onScanSuccess={handleScanSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
