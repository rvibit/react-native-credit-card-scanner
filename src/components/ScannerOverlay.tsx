import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RNHoleView } from 'react-native-hole-view';
import { type HoleViewConfig } from '../types';

interface ScannerOverlayProps {
  color: string;
  config: HoleViewConfig;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  color,
  config,
}) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <RNHoleView
        style={[StyleSheet.absoluteFill, { backgroundColor: color }]}
        holes={[
          {
            x: config.left,
            y: config.top,
            width: config.width,
            height: config.height,
            borderRadius: 12,
          },
        ]}
      />
      {/* Draw a subtle border around the hole cutout */}
      <View
        style={[
          styles.borderOverlay,
          {
            left: config.left,
            top: config.top,
            width: config.width,
            height: config.height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  borderOverlay: {
    // position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
});
