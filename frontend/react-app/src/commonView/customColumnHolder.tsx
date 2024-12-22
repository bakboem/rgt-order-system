import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CustomColumnHolderProps {
  multiplier?: number; 
}

const CustomColumnHolder: React.FC<CustomColumnHolderProps> = ({
  multiplier = 1,
}) => {
  const theme = useTheme(); 
  const height = theme.spacing(multiplier); 

  return (
    <Box
      sx={{
        height, 
        width: `0px`,
        backgroundColor: 'lightgray',
      }}
    />
  );
};

export default CustomColumnHolder;
