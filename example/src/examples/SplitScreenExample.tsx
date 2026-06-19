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
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  CreditCardScanner,
  type CardResult,
} from 'react-native-credit-card-scanner';
import { useCameraPermission } from 'react-native-vision-camera';

import { CreditCardMockup } from '../components/CreditCardMockup';
import { PaymentForm } from '../components/PaymentForm';

const { width, height } = Dimensions.get('window');
const TOP_HALF_HEIGHT = height / 2;

export const SplitScreenExample = (): React.JSX.Element => {
  // State for form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuer, setIssuer] = useState('Unknown');

  // State for scanner modal
  const [isScanning, setIsScanning] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const handleScanSuccess = (result: CardResult) => {
    setIsScanning(false); // Close scanner on success

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
    setIsScanning(true);
  };

  const handleCancelScan = () => {
    setIsScanning(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.topHalf}>
          {isScanning ? (
            <View style={styles.scannerContainer}>
              <CreditCardScanner
                style={styles.scanner}
                isActive={isScanning}
                onScanSuccess={handleScanSuccess}
                overlayColor="rgba(0, 0, 0, 0.8)"
                holeViewConfig={{
                  left: width * 0.1,
                  top: TOP_HALF_HEIGHT * 0.15,
                  width: width * 0.8,
                  height: (width * 0.8) / 1.586,
                }}
                parentViewHeight={TOP_HALF_HEIGHT}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelScan}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.scanningText}>Position card in frame</Text>
            </View>
          ) : (
            <View style={styles.idleContainer}>
              <View style={styles.mockupWrapper}>
                <CreditCardMockup
                  cardNumber={cardNumber}
                  cardholderName={cardholderName}
                  expiryDate={expiryDate}
                  issuer={issuer}
                />
              </View>
              {/* Overlay with a blurry/dark effect and button */}
              <View style={styles.idleOverlay}>
                <TouchableOpacity
                  style={styles.bigScanButton}
                  onPress={handleScanPress}
                >
                  <Text style={styles.bigScanButtonText}>
                    📷 Tap to Scan Card
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomHalf}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Checkout (Split)</Text>
              <Text style={styles.headerSubtitle}>
                Review or enter payment details
              </Text>
            </View>

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
        </View>
      </KeyboardAvoidingView>
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
  topHalf: {
    height: TOP_HALF_HEIGHT,
    backgroundColor: '#0F172A', // Dark elegant background for the top
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scanner: {
    flex: 1,
  },
  cancelButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  scanningText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  idleContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupWrapper: {
    width: '90%',
  },
  idleOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slightly darken the mockup
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigScanButton: {
    backgroundColor: '#3B82F6', // Vibrant blue
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  bigScanButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24, // Overlap the top half slightly
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
});
