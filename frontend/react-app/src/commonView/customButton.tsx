import React from 'react';
import { Button, Box, SxProps } from '@mui/material';
import { defaultButtonPropsMap } from '../style/props/buttonProps';
import { Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { s_buttonWidth } from '../style/size';
import { defaultButtonSx } from '../style/sx/buttonSx';

interface CustomButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  textKey?: string; 
  children?: React.ReactNode; 
  sx?: SxProps<Theme>; 
  isDisabled? : boolean,
  type?: 'button' | 'submit' | 'reset';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  textKey,
  children,
  sx = {},
  isDisabled ,
  type = 'button',
}) => {
  const { t } = useTranslation();

  const { width = s_buttonWidth }: any = sx;

  const buttonText = textKey ? t(textKey) : children;
  return (
    <Box sx={{ width }}>
      <Button
        disabled={isDisabled }
        {...defaultButtonPropsMap}
        type={type} 
        sx={{
          ...defaultButtonSx,
          ...sx,
          ...(isDisabled && {
            "&.Mui-disabled": {
              pointerEvents: "none",
              backgroundColor: "lightgray",
              color: "gray", 
              "&:hover": {
                backgroundColor: "lightgray", 
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
