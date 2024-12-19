import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
interface CustomRowHolderProps {
  multiplier?: number; // 控制宽度的倍数
}

const CustomRowHolder: React.FC<CustomRowHolderProps> = ({
  multiplier = 1,
}) => {
  const theme = useTheme(); // 获取当前主题
  const width = theme.spacing(multiplier); // 默认宽度为 10，乘以传入的倍数

  return (
    <Box
      sx={{
        height: `0px`,
        width,
        backgroundColor: 'lightgray',
      }}
    />
  );
};

export default CustomRowHolder;
