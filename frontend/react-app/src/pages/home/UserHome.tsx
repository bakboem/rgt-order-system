import React, { useEffect } from 'react';
import { isTokenValid } from '../../utils/tokenUtils';
import { login_route_name_for_user } from '../../config/statics';
import { useNavigate } from 'react-router-dom';

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userToken = sessionStorage.getItem('userToken');
    const activeToken = sessionStorage.getItem("activeToken");
    if (!(userToken && isTokenValid(userToken)&&  (userToken===activeToken) )) {
      navigate(login_route_name_for_user);
    }
  });

  return <div>this is UserHome</div>;
};

export default UserHome;
