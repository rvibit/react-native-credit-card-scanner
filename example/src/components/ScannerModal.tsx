import React, { useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  Button,
} from 'react-native';
import {
  CreditCardScanner,
  type CardResult,
} from 'react-native-credit-card-scanner';
import type { CameraRef } from 'react-native-vision-camera';

const { width, height } = Dimensions.get('window');
const overlayWidth = width * 0.85;
const overlayHeight = overlayWidth / 1.586; // Credit card aspect ratio

interface ScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (result: CardResult) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  visible,
  onClose,
  onScanSuccess,
}) => {
  const ref = useRef<CameraRef>(null);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.scannerContainer}>
          <CreditCardScanner
            style={styles.scanner}
            isActive={visible}
            onScanSuccess={onScanSuccess}
            overlayColor="rgba(0, 0, 0, 0.8)"
            holeViewConfig={{
              left: (width - overlayWidth) / 2,
              top: (height - overlayHeight) / 3, // Positioned slightly above center
              width: overlayWidth,
              height: overlayHeight,
            }}
            parentViewHeight={height}
            cameraRef={ref}
          />
        </View>
        <View style={styles.flashView}>
          <Button
            title="Toggle Flash"
            onPress={() => {
              if (ref?.current?.controller?.torchMode === 'on') {
                ref?.current?.controller?.setTorchMode('off');
              } else {
                ref?.current?.controller?.setTorchMode('on');
              }
            }}
          />
        </View>

        <SafeAreaView style={styles.footer}>
          <Text style={styles.instructions}>
            Position your card within the frame to scan automatically
          </Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    padding: 16,
    alignItems: 'flex-start',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
  },
  scanner: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 24,
    alignItems: 'center',
  },
  instructions: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  flashView: {
    position: 'absolute',
    bottom: 200,
    right: '50%',
    transform: [{ translateX: 60 }],
  },
});
