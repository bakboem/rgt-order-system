import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/tokenUtils';
import { login_route_name_for_biz } from '../../config/statics';

const BizHome: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const bizToken = sessionStorage.getItem('bizToken');
    const activeToken = sessionStorage.getItem("activeToken");
    if (!(bizToken && isTokenValid(bizToken)&& (bizToken===activeToken) )) {
      navigate(login_route_name_for_biz);
    }
  });

  return <div>this is BizHome</div>;
};

export default BizHome;
