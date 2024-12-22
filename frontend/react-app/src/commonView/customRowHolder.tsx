import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
interface CustomRowHolderProps {
  multiplier?: number; 
}

const CustomRowHolder: React.FC<CustomRowHolderProps> = ({
  multiplier = 1,
}) => {
  const theme = useTheme();
  const width = theme.spacing(multiplier); 

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
