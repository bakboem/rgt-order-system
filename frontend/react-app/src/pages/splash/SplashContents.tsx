import Box from '@mui/material/Box/Box';
import React from 'react';
import {
  defaultContainerColumnSx,
  defaultContainerRowSx,
} from '../../style/sx/containerSx';
import CustomText from '../../commonView/customText';
import CustomButton from '../../commonView/customButton';
import { useNavigate } from 'react-router-dom';
import { entryPage } from '../../config/statics';
import { s_full } from '../../style/size';
import { as_center } from '../../style/align';
import CustomColumnHolder from '../../commonView/customColumnHolder';
import CustomRowHolder from '../../commonView/customRowHolder';
import { homeTabBarState } from '../../state/homePageState/atoms';
import { useRecoilState } from 'recoil';

const SplashContents: React.FC = () => {
    const [tabIndex,setIndex] = useRecoilState(homeTabBarState);
  const navigate = useNavigate();

  const handleButtonClick = (target: string) => {
    setIndex(0);
    console.log(tabIndex)
    navigate(entryPage, { state: { target } }); // 将点击的目标类型传递到EntryPage
  };
  const gotoUser = 'Go to User';
  const gotoHome = 'Go to Home';
  const welcome = ' Welcome';
  const userButtonText = '사용자';
  const bizButtonText = '운영자';
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

      <Box sx={defaultContainerRowSx}>
        <CustomButton
          onClick={async() => handleButtonClick('user')}
          textKey={userButtonText}
        >
          {gotoUser}
        </CustomButton>

        <CustomRowHolder />

        <CustomButton
          onClick={async () => handleButtonClick('biz')}
          textKey={bizButtonText}
        >
          {gotoHome}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default SplashContents;
