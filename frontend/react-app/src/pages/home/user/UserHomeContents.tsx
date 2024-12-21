import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { homeTabBarState } from "../../../state/homePageState/atoms";
import { as_center, as_start } from "../../../style/align";
import { s_full } from "../../../style/size";
import { defaultContainerColumnSx } from "../../../style/sx/containerSx";
import ManagementPageForUser from "./management/ManagementPageForUser";
import DashboardPageForUser from "./dashborad/DashboardPageForUser";



const UserHomeContents: React.FC = () => {
  const [tabIndex] = useRecoilState(homeTabBarState);

  return (
    <Box
      sx={{
        ...defaultContainerColumnSx,
        width: s_full,
        height: s_full,
        alignItems: as_center,
        justifyContent: as_start,
      }}
    >
      {tabIndex === 0 ? <ManagementPageForUser /> : <DashboardPageForUser />}
    </Box>
  );
};

export default UserHomeContents;
