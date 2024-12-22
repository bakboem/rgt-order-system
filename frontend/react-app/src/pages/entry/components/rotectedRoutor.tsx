// src/components/ProtectedRoute.tsx

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  // if (!auth.isLoggedIn) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default ProtectedRoute;
