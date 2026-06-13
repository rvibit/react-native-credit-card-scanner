import { useTextRecognition } from 'react-native-vision-camera-ocr-plus';
import { useFrameOutput } from 'react-native-vision-camera';
import { scheduleOnRN } from 'react-native-worklets';
import { parseCardData } from '../utils/parsers';
import { isValidLuhn } from '../utils/validators';
import { type CardResult, type HoleViewConfig } from '../types';
import { Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

interface UseCardScannerProps {
  onScanSuccess: (result: CardResult) => void;
  holeViewConfig: HoleViewConfig;
  parentViewHeight?: number;
}

export const useCardScanner = ({
  onScanSuccess,
  holeViewConfig,
  parentViewHeight,
}: UseCardScannerProps) => {
  const handleSuccess = (data: CardResult) => {
    onScanSuccess(data);
  };
  const HEIGHT = parentViewHeight ? parentViewHeight : windowHeight;
  const { scanText } = useTextRecognition({
    language: 'latin',
    frameSkipThreshold: 10,
    scanRegion: {
      left: `${(holeViewConfig.left / windowWidth) * 100}%`,
      top: `${(holeViewConfig.top / HEIGHT) * 100}%`,
      width: `${(holeViewConfig.width / windowWidth) * 100}%`,
      height: `${(holeViewConfig.height / HEIGHT) * 100}%`,
    },
  });

  const frameOutput = useFrameOutput({
    pixelFormat: 'rgb',
    onFrame: (frame) => {
      'worklet';

      const result = scanText(frame);
      if (result.resultText) {
        const cardData = parseCardData(result.blocks);

        if (cardData.cardNumber && isValidLuhn(cardData.cardNumber)) {
          scheduleOnRN(handleSuccess, cardData as CardResult);
        }
      }

      frame.dispose();
    },
  });

  return { frameOutput };
};
