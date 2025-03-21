import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div>
      <Outlet />  {/* This will render the child routes: Login and Register */}
    </div>
  );
};

export default AuthLayout;
