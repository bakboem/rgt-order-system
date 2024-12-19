import CustomText from './customText';
import { c_primary } from '../style/colors';

interface BigTextProps {
  text: string;
  color?: string;
}
export const BigTextView: React.FC<BigTextProps> = ({ text, color }) => {
  return (
    <CustomText variant="h4" color={color ? color : c_primary}>
      {text}
    </CustomText>
  );
};
