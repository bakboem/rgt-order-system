import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

interface CustomTextProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'; // Material-UI 支持的 variant
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'; // 文字对齐方式
  color?: string; // 可选的文本颜色
  textKey?: string; // 翻译用的键值
  children?: React.ReactNode; // 子元素内容
}

const CustomText: React.FC<CustomTextProps> = ({
  variant = 'body1',
  align = 'left',
  color = 'inherit',
  textKey,
  children,
}) => {
  const theme = useTheme(); // 获取主题
  const { t } = useTranslation();

  const translatedText = textKey ? t(textKey) : children;

  return (
    <Typography
      variant={variant}
      align={align}
      color={color === 'inherit' ? theme.palette.text.primary : color}
      sx={{
        fontFamily:
          theme.typography[variant]?.fontFamily || theme.typography.fontFamily, // 从主题中获取字体
      }}
    >
      {translatedText}
    </Typography>
  );
};

export default CustomText;
