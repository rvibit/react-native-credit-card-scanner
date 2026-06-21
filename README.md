# react-native-credit-card-scanner

A high-performance credit card scanning library for React Native built on top of Vision Camera.

## Demo

https://github.com/user-attachments/assets/0c07269a-17da-410f-aacd-a179115bfac4

## Requirements

| Requirement                         | Minimum version |
| ----------------------------------- | --------------- |
| React Native                        | 0.81            |
| iOS                                 | 15.1            |
| Android Minimum SDK                 | 26              |
| Android Target SDK                  | 36              |
| react-native-vision-camera          | 5.0.0           |
| react-native-vision-camera-ocr-plus | 2.0.0           |
| react-native-worklets               | 0.8.x           |
| Expo (if used)                      | 54              |

## Installation

### 1. Install the library

```sh
npm install react-native-credit-card-scanner
# or
yarn add react-native-credit-card-scanner
```

### 2. Install Peer Dependencies

This library relies on several peer dependencies to function properly. You must install them in your project:

```sh
npm install react-native-vision-camera \
  react-native-vision-camera-ocr-plus \
  react-native-hole-view \
  react-native-vision-camera-worklets \
  react-native-worklets \
  react-native-nitro-modules \
  react-native-nitro-image
```

### Peer dependencies

| Package                               | Version   |
| ------------------------------------- | --------- |
| `react-native-vision-camera`          | `>=5.0.0` |
| `react-native-vision-camera-ocr-plus` | `>=2.0.0` |
| `react-native-hole-view`              | `*`       |
| `react-native-nitro-modules`          | `*`       |
| `react-native-nitro-image`            | `*`       |
| `react-native-vision-camera-worklets` | `*`       |
| `react-native-worklets`               | `>=0.8.0` |

### 3. Add Babel Plugin for Worklets

You must add the worklets plugin to your `babel.config.js`:

```javascript
module.exports = {
  //other options.....
  plugins: [
    // ...other plugins
    ['react-native-worklets/plugin'],
  ],
};
```

> **Warning**: Ensure you clear your bundler cache after adding the babel plugin (e.g., `npm start -- --reset-cache` or `yarn start --reset-cache`).

### 4. Setup Permissions

#### iOS

Add the camera permission to your `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to scan credit cards.</string>
```

#### Android

Add the camera permission to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

### 5. Expo Usage

This library works with Expo, **but only with custom Expo Development Builds (Prebuild)** or the Bare Workflow. It **will not work in Expo Go** due to its reliance on custom native code, C++ Nitro Modules, and JSI.

If you are using Expo, make sure to follow the specific setup guides for Expo in the official documentation of our core dependencies:

- [React Native Vision Camera - Expo Guide](https://react-native-vision-camera.com/docs/guides/getting-started)
- [React Native Worklets - Getting Started](https://docs.swmansion.com/react-native-worklets/docs/fundamentals/getting-started/)

You will typically need to configure the `app.json` config plugins for Vision Camera to automatically handle camera permissions during prebuild.

---

## Available Components

### `CreditCardScanner`

The main orchestrator component that handles rendering the camera, drawing the overlay cutout, and processing the OCR output.

#### Props

| Prop               | Type                               | Description                                                                                                                                                                                                |
| ------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isActive`         | `boolean`                          | Determines if the camera and scanner are actively running. Pass `false` to pause/hide it and save battery.                                                                                                 |
| `onScanSuccess`    | `(result: CardResult) => void`     | Callback triggered when a valid credit card is successfully scanned and verified.                                                                                                                          |
| `cameraRef`        | `React.RefObject<CameraRef\|null>` | _(Optional)_ Programatically control camera properties/functions.                                                                                                                                          |
| `overlayColor`     | `string`                           | _(Optional)_ The color of the dimming mask over the camera (e.g., `rgba(0, 0, 0, 0.7)`).                                                                                                                   |
| `holeViewConfig`   | `HoleViewConfig`                   | _(Optional)_ Configuration object specifying the position and size of the clear cutout window where the card should be aligned. Includes `left`, `top`, `width`, and `height`.                             |
| `parentViewHeight` | `number`                           | _(Optional)_ The exact height of the parent container holding the scanner, required for accurate proportional cutout bounds and scanRegion mapping (always pass it if the camera view is not full screen). |
| `style`            | `ViewStyle`                        | _(Optional)_ Style applied to the underlying container wrapper.                                                                                                                                            |
| `cameraProps`      | `Partial<CameraProps>`             | _(Optional)_ Pass vision camera props to <Camera /> component.                                                                                                                                             |

#### Types

**`CardResult`**

```typescript
interface CardResult {
  cardNumber: string; // The 13-19 digit card number
  expiryDate: string | null; // e.g., '12/26'
  cardholderName: string | undefined; // Extracted name (if matched)
  issuer: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown';
}
```

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import {
  CreditCardScanner,
  type CardResult,
} from 'react-native-credit-card-scanner';
import { useCameraPermission } from 'react-native-vision-camera';

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const handleScanSuccess = (result: CardResult) => {
    setIsActive(false);
    console.log('Card Scanned:', result.cardNumber);
  };

  const startScan = () => {
    if (!hasPermission) requestPermission();
    else setIsActive(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isActive ? (
        <CreditCardScanner
          isActive={isActive}
          onScanSuccess={handleScanSuccess}
          overlayColor="rgba(0, 0, 0, 0.8)"
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Button title="Scan Credit Card" onPress={startScan} />
        </View>
      )}
    </View>
  );
}
```

## Acknowledgments

This library depends on several awesome packages by community, Thanks to the authors of these libraries for making this possible.

- [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)
- [react-native-vision-camera-ocr-plus](https://github.com/jamenamcinteer/react-native-vision-camera-ocr-plus)
- [react-native-hole-view](https://github.com/ibitcy/react-native-hole-view)
- [react-native-worklets](https://docs.swmansion.com/react-native-worklets)

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
