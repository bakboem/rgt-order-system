// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../state/entryPageState/atoms';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authState);

  if (!auth.isLoggedIn) {
    // 用户未登录，重定向到登录页面
    return <Navigate to="/" />;
  }

  // 用户已登录，允许访问目标页面
  return children;
};

export default ProtectedRoute;
