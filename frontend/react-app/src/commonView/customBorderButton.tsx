import React from 'react';
import { Button, Box } from '@mui/material';
import { borderButtonPropsMap } from '../style/props/buttonProps';
import { Theme, SxProps } from '@mui/system';
import { s_buttonWidth } from '../style/size';
import { borderButtonSx } from '../style/sx/buttonSx';

interface CustomBorderButtonProps {
  onClick: () => void; // 按钮点击事件处理器
  children: React.ReactNode; // 按钮的子元素内容
  sx?: SxProps<Theme>; // 可选的自定义样式
}

const CustomBorderButton: React.FC<CustomBorderButtonProps> = ({
  onClick,
  children,
  sx = {},
}) => {
  const { width = s_buttonWidth }: any = sx;

  return (
    <Box
      sx={{
        width,
        // 将 width 作用到 Box
      }}
    >
      <Button
        {...borderButtonPropsMap}
        sx={{ ...borderButtonSx, ...sx }}
        onClick={onClick}
      >
        {children}
      </Button>
    </Box>
  );
};

export default CustomBorderButton;
