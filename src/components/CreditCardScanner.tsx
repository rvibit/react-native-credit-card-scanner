import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useCardScanner } from '../hooks/useCardScanner';
import { ScannerOverlay } from './ScannerOverlay';
import { type CreditCardScannerProps } from '../types';
const width = Dimensions.get('window').width * 0.95;
const height = width / 1.586;

export const CreditCardScanner: React.FC<CreditCardScannerProps> = ({
  isActive,
  onScanSuccess,
  onError,
  style,
  overlayColor = 'rgba(0, 0, 0, 0.6)',
  holeViewConfig = {
    left: 10,
    top: 50,
    width: width,
    height: height,
  },
  cameraProps,
  parentViewHeight,
}) => {
  const device = useCameraDevice('back');
  // Custom hook that manages MLKit and the validation pipeline
  const { frameOutput } = useCardScanner({
    onScanSuccess,
    holeViewConfig,
    parentViewHeight,
  });

  if (!device) {
    if (onError) onError(new Error('No back camera device found'));
    return (
      <View style={style}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        outputs={[frameOutput]}
        {...cameraProps}
      />
      <ScannerOverlay color={overlayColor} config={holeViewConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
