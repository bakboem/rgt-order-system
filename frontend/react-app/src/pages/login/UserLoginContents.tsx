import { Box } from '@mui/material';
import React, { useState } from 'react';
import { defaultContainerColumnSx } from '../../style/sx/containerSx';
import { s_full, s_submmitButtonWidth } from '../../style/size';
import { as_center } from '../../style/align';
import CustomTextField from '../../commonView/customTextField';
import CustomColumnHolder from '../../commonView/customColumnHolder';
import CustomButton from '../../commonView/customButton';
import CustomText from '../../commonView/customText';
import { apiRequest } from '../../services/apiService';
import { LoginResponseModel } from '../../models/responseModels';
import { ApiRequestType } from '../../enums/apiRequestType';
import { useNavigate } from 'react-router-dom';
import { home_route_name_for_user } from '../../config/statics';

const UserLoginContents: React.FC = () => {
  const navigate = useNavigate();

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
    if (!(username && password)) return;
    try {
      console.log("Starting login process...");
      const response = await apiRequest<LoginResponseModel>(ApiRequestType.USER_LOGIN, {
        body: { username, password },
      });
      console.log(response);
      if (response.access_token) {
        console.log("Login successful:", response.access_token);
        sessionStorage.setItem("userToken", response.access_token);
        sessionStorage.setItem("activeToken",response.access_token);
        navigate(home_route_name_for_user);
      }
     
    } catch (err) {
      console.error("Login failed:", err);
    }
    // await login(username, password);
  };
  const userNameInputText = "아이디";
  const userPasswordInputText = "비밀번호";
  const submmitButtonText = "로그인";
  const welcome = "사용자 로그인";
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
        onClick={ handleSubmit}
      />
    </Box>
  );
};

export default UserLoginContents;
