import { ButtonProps } from '@mui/material';
export const defaultButtonPropsMap: ButtonProps = {
  variant: 'contained',
  color: 'primary',
  disabled: false,
  fullWidth: true,
  disableElevation: true,
  disableRipple: false,
};
export const borderButtonPropsMap: ButtonProps = {
  ...defaultButtonPropsMap,
  variant: 'outlined',
};
