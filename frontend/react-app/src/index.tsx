import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import EntryPage from './pages/entry/EntryPage';
import SplashPage from './pages/splash/SplashPage';
import {
  entryPage,
  home_route_name_for_biz,
  home_route_name_for_user,
  login_route_name_for_biz,
  login_route_name_for_user,
  splashPage,
} from './config/statics';
import BizHome from './pages/home/BizHome';
import UserHome from './pages/home/UserHome';
import BizLogin from './pages/login/BizLogin';
import UserLogin from './pages/login/UserLogin';
import { ThemeProvider } from '@mui/material/styles';
import { appTheme } from './style/theme';
import UnauthorizedHandler from './services/unauthorizedHandle';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <RecoilRoot>
    <React.StrictMode>

    {/* // prod */}
    <ThemeProvider theme={appTheme}>
      <Router>
        {/* <Router> */}
        <ToastContainer />
        <UnauthorizedHandler /> {/* 全局监听 401 事件 */}
        <Routes>
          <Route path={home_route_name_for_biz} element={<BizHome />} />
          <Route path={home_route_name_for_user} element={<UserHome />} />
          <Route path={login_route_name_for_biz} element={<BizLogin />} />
          <Route path={login_route_name_for_user} element={<UserLogin />} />
          <Route path={splashPage} element={<SplashPage />} />
          <Route path={entryPage} element={<EntryPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </React.StrictMode>
  </RecoilRoot>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
