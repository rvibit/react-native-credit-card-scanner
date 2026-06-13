import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  Alert,
} from 'react-native';
import {
  CreditCardScanner,
  type CardResult,
} from 'react-native-credit-card-scanner';
import { useCameraPermission } from 'react-native-vision-camera';

const width = Dimensions.get('window').width * 0.95;
const height = width / 1.586;

const HEIGHT = Dimensions.get('window').height / 2;
export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [cardResult, setCardResult] = useState<CardResult | null>(null);

  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const handleScanSuccess = (result: CardResult) => {
    setCardResult(result);
    Alert.alert(result.cardNumber);
    setIsActive(false); // Stop scanning after success
  };

  return (
    <View style={styles.container}>
      <>
        <View style={{ height: HEIGHT }}>
          <CreditCardScanner
            style={styles.scanner}
            isActive={isActive}
            onScanSuccess={handleScanSuccess}
            overlayColor="rgba(0, 0, 0, 0.7)"
            holeViewConfig={{
              left: 10,
              top: 50,
              width: width,
              height: height,
            }}
            parentViewHeight={HEIGHT}
          />
        </View>
        <View style={styles.resultsContainer}>
          <Text style={styles.title}>Credit Card Scanner</Text>

          {cardResult && (
            <View style={styles.cardDetails}>
              <Text>Number: {cardResult.cardNumber}</Text>
              <Text>Expiry: {cardResult.expiryDate || 'N/A'}</Text>
              <Text>Name: {cardResult.cardholderName || 'N/A'}</Text>
              <Text>Issuer: {cardResult.issuer}</Text>
            </View>
          )}

          <Button
            title={isActive ? 'Scanning...' : 'Scan Card'}
            onPress={() => setIsActive(!isActive)}
          />
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scanner: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  cardDetails: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
});
