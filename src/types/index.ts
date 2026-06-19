import { type ViewStyle, type StyleProp } from 'react-native';
import { type CameraProps, type CameraRef } from 'react-native-vision-camera';

export interface CardResult {
  cardNumber: string;
  expiryDate: string | null; // Format: MM/YY
  cardholderName: string | null;
  issuer:
    | 'Visa'
    | 'Mastercard'
    | 'Amex'
    | 'RuPay'
    | 'Discover'
    | 'Diners Club'
    | 'JCB'
    | 'Mir'
    | 'UnionPay'
    | 'Maestro'
    | 'InstaPayment'
    | 'Unknown';
}

export interface HoleViewConfig {
  left: number; // Percentages (e.g., 10 for 10%)
  top: number;
  width: number;
  height: number;
}

export interface CreditCardScannerProps {
  /** Ref to controll camera programatically */
  cameraRef?: React.RefObject<CameraRef | null> | undefined;
  /** Enables or disables the camera and frame processing */
  isActive: boolean;

  /** Callback fired when a valid card is detected (passes Luhn check) */
  onScanSuccess: (result: CardResult) => void;

  /** Callback for camera initialization or permission errors */
  onError?: (error: Error) => void;

  /** Container style to allow full-screen or partial-screen rendering */
  style?: StyleProp<ViewStyle>;

  /** Optional: Customize the HoleView overlay mask */
  overlayColor?: string; // Default: 'rgba(0,0,0,0.6)'

  /** Optional: Customize the cutout coordinates */
  holeViewConfig?: HoleViewConfig;

  /** Optional: Pass down native camera props (e.g., enable torch) */
  cameraProps?: Partial<CameraProps>;

  /** Optional: Pass parent height to align hole view correctly with scan region */
  parentViewHeight?: number;
}
