import React from 'react';
import CustomText from './customText';

interface SmallTextProps {
  text: string;
  color?: string;
}
export const SmallText: React.FC<SmallTextProps> = ({ text, color }) => {
  return (
    <CustomText variant="caption" color={color ? color : '#8D8D94E0'}>
      {text ? text : '-'}
    </CustomText>
  );
};
