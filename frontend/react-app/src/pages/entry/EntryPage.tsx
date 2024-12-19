/* eslint-disable no-console */
import React, { useEffect } from "react";
import { appTheme } from "../../style/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes,  } from "react-router-dom";
import { home_route_name_for_biz, home_route_name_for_user } from "../../config/statics";

import BizHome from "../home/BizHome";
import UserHome from "../home/UserHome";

const EntryPage: React.FC = () => {
  
  useEffect(() => {
  }, []);

   
  return (
    <ThemeProvider theme={appTheme}>
      <Routes>
        {/* 如果用户已登录，显示 HomePage；否则显示 LoginPage */}
        <Route path={home_route_name_for_biz} element={<BizHome />} />
        <Route path={home_route_name_for_user} element={<UserHome />} />
        {/* <Route path={login_route_name} element={<LoginPage />} />
        <Route path="/" element={isLoggedIn ? <HomePage /> : <LoginPage />} /> */}
      </Routes>
    </ThemeProvider>
  );
};

export default EntryPage;
