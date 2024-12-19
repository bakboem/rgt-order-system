
// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../../../state/entryPageState/atoms";
import { entry_page_route } from "../../../config/statics";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authState);

  if (!auth.isLoggedIn) {
    // 用户未登录，重定向到登录页面
    return <Navigate to={entry_page_route} />;
  }

  // 用户已登录，允许访问目标页面
  return children;
};

export default ProtectedRoute;
