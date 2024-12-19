import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  home_route_name_for_user,
  home_route_name_for_biz,
  login_route_name_for_user,
  login_route_name_for_biz,
  splashPage,
  userTokenName,
  entryPage,
} from '../../config/statics';

const EntryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  React.useEffect(() => {
    const target = state?.target;
    if (!target) {
      navigate(splashPage);
      return;
    }
    const isCurrentUrl =  window.location.pathname=== entryPage;
    if (target === 'user'&& isCurrentUrl ) {
      const userToken = sessionStorage.getItem(userTokenName);
      if (userToken) {
        console.log('Home page User');
        navigate(home_route_name_for_user);
      } else {
        console.log('login page Home');
        navigate(login_route_name_for_user);
      }
    } else if (target === 'biz'&& isCurrentUrl) {
      const bizToken = sessionStorage.getItem('bizToken');
      if (bizToken) {
        console.log('Home page Biz');
        navigate(home_route_name_for_biz);
      } else {
        console.log('login page Biz');
        navigate(login_route_name_for_biz);
      }
    }
  }, [state, navigate]);

  return null;
};

export default EntryPage;
