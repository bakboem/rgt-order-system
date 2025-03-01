import React from 'react';
import { Box, SxProps, TextField } from '@mui/material';
import { defaultTextfieldButtonSx } from '../style/sx/buttonSx';
import { Theme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

interface CustomTextFieldProps {
  value: string; // 输入框的值
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // onChange 回调函数
  sx?: SxProps<Theme>; // 可选的自定义样式
  type?: 'text' | 'password' | 'number'; // 输入框的类型，支持文本、密码和数字
  maxLength?: number; // 最大字符长度，默认 200
  width?: number;
  labelKey: string; // 支持传入翻译键用于 label
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  value,
  onChange,
  sx,
  type = 'text', 
  maxLength = 200, 
  width,
  labelKey,
}) => {
  const { t } = useTranslation();

  
  const translatedLabel = t(labelKey);

  return (
    <Box sx={{ width: width }}>
      <TextField
        label={translatedLabel}
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChange}
        type={type} 
        slotProps={{
          htmlInput: { maxLength: maxLength },
        }}
        sx={sx ? sx : defaultTextfieldButtonSx} 
      />
    </Box>
  );
};

export default CustomTextField;
