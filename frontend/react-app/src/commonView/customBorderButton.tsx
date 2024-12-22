import React from 'react';
import { Button, Box } from '@mui/material';
import { borderButtonPropsMap } from '../style/props/buttonProps';
import { Theme, SxProps } from '@mui/system';
import { s_buttonWidth } from '../style/size';
import { borderButtonSx } from '../style/sx/buttonSx';

interface CustomBorderButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const CustomBorderButton: React.FC<CustomBorderButtonProps> = ({
  onClick,
  children,
  sx = {},
}) => {
  const { width = s_buttonWidth }: any = sx;

  return (
    <Box sx={{ width }}>
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
