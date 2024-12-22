import React from 'react';
import { Button, Box, SxProps } from '@mui/material';
import { defaultButtonPropsMap } from '../style/props/buttonProps';
import { Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { s_buttonWidth } from '../style/size';
import { defaultButtonSx } from '../style/sx/buttonSx';

interface CustomButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;// 按钮点击事件处理器
  textKey?: string; // 用于翻译按钮文本的 i18n 键
  children?: React.ReactNode; // 按钮的子元素内容，和 textKey 互斥
  sx?: SxProps<Theme>; // 可选的自定义样式
  isDisabled? : boolean,
  type?: 'button' | 'submit' | 'reset'; // 支持按钮的类型
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  textKey,
  children,
  sx = {},
  isDisabled ,
  type = 'button', // 默认按钮类型为 "button"
}) => {
  const { t } = useTranslation();

  const { width = s_buttonWidth }: any = sx;

  // 如果提供了 textKey，则使用翻译文本，否则使用 children
  const buttonText = textKey ? t(textKey) : children;
  return (
    <Box sx={{ width }}>
      <Button
        disabled={isDisabled }
        {...defaultButtonPropsMap}
        type={type} // 设置按钮类型
        sx={{
          ...defaultButtonSx, // 确保按钮填满父容器的宽度
          ...sx,
          ...(isDisabled && {
            "&.Mui-disabled": {
              pointerEvents: "none", // 禁用 hover 效果
              backgroundColor: "lightgray", // 自定义禁用背景色
              color: "gray", // 自定义禁用文本颜色
              "&:hover": {
                backgroundColor: "lightgray", // 禁用 hover 效果的背景色
              },
            },
          }),
        }}

        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default CustomButton;
