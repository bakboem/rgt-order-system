import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import CustomBorderButton from "../../../commonView/customBorderButton";
import CustomRowHolder from "../../../commonView/customRowHolder";
import CustomText from "../../../commonView/customText";
import { homeTabBarState } from "../../../state/homePageState/atoms";
import { c_white, c_primary } from "../../../style/colors";
import { f_body } from "../../../style/font";
import { rowStart_columnCenter } from "../../../style/sx/alignSx";
import { defaultContainerRowSx } from "../../../style/sx/containerSx";


const ComponentTabBar: React.FC = () => {
  const [tabIndex, setTabIndex] = useRecoilState(homeTabBarState);
  const changedIndexOneColor = tabIndex === 1 ? c_white : c_primary;
  const changedIndexTwoColor = tabIndex === 1 ? c_primary : c_white;

  const changedBg = tabIndex === 1 ? { backgroundColor: c_primary } : {};
  const changedBg2 = tabIndex === 1 ? {} : { backgroundColor: c_primary };

  return (
    <Box
      sx={{
        ...defaultContainerRowSx,
        width: "58vw",
      }}
    >
      <CustomBorderButton
        sx={{ ...changedBg2 }}
        onClick={() => setTabIndex(0)}
        children={
          <Box sx={{ ...rowStart_columnCenter }}>
          
            <CustomText
              textKey={"메인"}
              variant={f_body}
              color={changedIndexTwoColor}
            ></CustomText>
          </Box>
        }
      />
      <CustomRowHolder />
      <CustomBorderButton
        onClick={() => setTabIndex(1)}
        children={
          <Box sx={{ ...rowStart_columnCenter }}>
            <CustomText
              textKey={"데시보드"}
              variant={f_body}
              color={changedIndexOneColor}
            ></CustomText>
          </Box>
        }
        sx={changedBg}
      />
    
    </Box>
  );
};

export default ComponentTabBar;
