/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import CustomText from '../../../../commonView/customText';
import { Box } from '@mui/material';
import {
  defaultContainerColumnSx,
  defaultContainerRowSx,
} from '../../../../style/sx/containerSx';
import { as_center, as_start } from '../../../../style/align';
import CustomColumnHolder from '../../../../commonView/customColumnHolder';
import CustomTextField from '../../../../commonView/customTextField';
import CustomButton from '../../../../commonView/customButton';
import { s_full } from '../../../../style/size';
import CustomRowHolder from '../../../../commonView/customRowHolder';
import {
  useGetBizMenuList,
  useRequestBizMenu,
} from '../../../../state/bizPageState/hooks';
import { MenuRequestModel } from '../../../../models/responseModels';
import { showSuccessToast, showWarnToast } from '../../../../utils/toastUtil';
import { login_route_name_for_user } from '../../../../config/statics';
import { isActiveBiz } from '../../../../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

const MenuRequestConetents: React.FC = () => {
  const pageName = '메뉴생성';
  const manuNameStr = '메뉴명';
  const menuPriceStr = '단가';
  const menuInstockStr = '재고';
  const submmitBtnStr = '생성하기';
  const checkInputStr = '필수 입력값을 채워주세요';
  const successCreateMenuStr = '메뉴가 생성됐습니다';
  const inputSx = {
    ...defaultContainerRowSx,
    justifyItems: as_center,
    alignItems: as_center,
  };

  const {requestMenu} = useRequestBizMenu();
  const {getBizMenu} = useGetBizMenuList();
  const navigate = useNavigate();
  //  INIT 
  useEffect(() => {
    if (!isActiveBiz()) {
      navigate(login_route_name_for_user);
    } else {
      console.warn("request Menu!!!!")
      getBizMenu();
    }
  }, []);

  const [menuName, setManuName] = useState('');
  const [price, setPrice] = useState('');
  const [instock, setInstock] = useState('');

  const handleMenuNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManuName(event.target.value);
  };
  const handleManuInstockChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInstock(event.target.value);
  };

  const handleManuPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPrice(event.target.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    if (!(manuNameStr && price && instock)) {
      showWarnToast(checkInputStr);
      return;
    }
    const requestModel: MenuRequestModel = {
      name: menuName,
      price: parseFloat(price),
      stock: parseInt(instock),
      image_url: '',
    };
    await requestMenu(requestModel, () => {
      showSuccessToast(successCreateMenuStr);
      setManuName('');
      setPrice('');
      setInstock('');
    });
  };
  return (
    <Box
      sx={{
        ...defaultContainerColumnSx,
        alignItems: as_center,
        justifyItems: as_start,
      }}
    >
      <CustomColumnHolder multiplier={3} />
      <Box sx={{ ...defaultContainerRowSx, width: s_full }}>
        <CustomRowHolder multiplier={6} />
        <CustomText>{pageName}</CustomText>
      </Box>

      <CustomColumnHolder multiplier={3} />
      <Box sx={inputSx}>
        <Box sx={{ width: 80 }}>
          <CustomText> {manuNameStr}</CustomText>
        </Box>
        <CustomTextField
          value={menuName}
          onChange={handleMenuNameChange}
          labelKey={''}
        ></CustomTextField>
      </Box>
      <CustomColumnHolder multiplier={3} />

      <Box sx={inputSx}>
        <Box sx={{ width: 80 }}>
          <CustomText> {menuPriceStr}</CustomText>
        </Box>

        <CustomTextField
          value={price}
          onChange={handleManuPriceChange}
          labelKey={''}
          type="number"
        ></CustomTextField>
      </Box>
      <CustomColumnHolder multiplier={3} />
      <Box sx={inputSx}>
        <Box sx={{ width: 80 }}>
          <CustomText> {menuInstockStr}</CustomText>
        </Box>

        <CustomTextField
          value={instock}
          onChange={handleManuInstockChange}
          labelKey={''}
          type="number"
        ></CustomTextField>
      </Box>
      <CustomColumnHolder multiplier={3} />
      <Box sx={{ ...defaultContainerRowSx, width: s_full }}>
        <CustomRowHolder multiplier={6} />
        <CustomButton onClick={handleSubmit}> {submmitBtnStr}</CustomButton>
      </Box>
    </Box>
  );
};

export default MenuRequestConetents;
