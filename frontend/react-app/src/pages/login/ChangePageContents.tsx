import React from 'react';
import { Box } from '@mui/material';
import { defaultContainerRowSx } from '../../style/sx/containerSx';
import { as_center, as_end } from '../../style/align';
import { s_full, s_padding, s_submmitButtonWidth } from '../../style/size';
import CustomButton from '../../commonView/customButton';
import { useNavigate } from 'react-router-dom';
import { splashPage } from '../../config/statics';

const ChangePageContents: React.FC = () => {
  const submmitButtonText = 'Change';
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        ...defaultContainerRowSx,

        height: s_full,
        width: s_full,
        alignItems: as_center,
        padding: s_padding,
        justifyContent: as_end,
      }}
    >
      <CustomButton
        sx={{ width: s_submmitButtonWidth }}
        textKey={submmitButtonText}
        type="submit"
        onClick={() => {
          navigate(splashPage);
        }}
      />
    </Box>
  );
};

export default ChangePageContents;
