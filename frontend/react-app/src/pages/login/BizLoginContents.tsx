import { Box } from '@mui/material';
import React, { useState } from 'react';
import { defaultContainerColumnSx } from '../../style/sx/containerSx';
import { s_full, s_submmitButtonWidth } from '../../style/size';
import { as_center } from '../../style/align';
import CustomTextField from '../../commonView/customTextField';
import CustomColumnHolder from '../../commonView/customColumnHolder';
import CustomButton from '../../commonView/customButton';
import CustomText from '../../commonView/customText';

const BizLoginContents:React.FC = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
  
    const handleIdChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setUserName(event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // await login(username, password);
    };
    const userNameInputText = "아이디";
    const userPasswordInputText = "비밀번호";
    const submmitButtonText = "로그인";
    const welcome = "운영자 로그인";
    return (
      <Box
        sx={{
          ...defaultContainerColumnSx,
          height: s_full,
          alignItems: as_center,
          justifyContent: as_center,
        }}
      >
  
  <CustomText variant="h3">{welcome}</CustomText>
  
  <CustomColumnHolder multiplier={3}></CustomColumnHolder>
  
        <CustomTextField
          labelKey={userNameInputText}
          value={username}
          onChange={handleIdChange}
        />
        <CustomColumnHolder multiplier={3} />
        <CustomTextField
          labelKey={userPasswordInputText}
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <CustomColumnHolder multiplier={3} />
        <CustomButton
          sx={{ width: s_submmitButtonWidth }}
          textKey={submmitButtonText}
          type="submit"
          onClick={() => handleSubmit}
        />
      </Box>
    );
};

export default BizLoginContents;