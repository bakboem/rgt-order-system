import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CustomColumnHolderProps {
  multiplier?: number; // 控制高度的倍数
}

const CustomColumnHolder: React.FC<CustomColumnHolderProps> = ({
  multiplier = 1,
}) => {
  const theme = useTheme(); // 获取当前主题
  const height = theme.spacing(multiplier); // 使用 theme.spacing 计算高度

  return (
    <Box
      sx={{
        height, // 高度通过 theme.spacing 控制
        width: `0px`,
        backgroundColor: 'lightgray',
      }}
    />
  );
};

export default CustomColumnHolder;
