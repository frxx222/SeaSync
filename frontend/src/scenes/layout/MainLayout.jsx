import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/store';

const MainLayout = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up('sm'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userRole = useAuthStore((state) => state.auth.role);

  // Redirect to login if no role
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  return (
    <Box
      sx={{
        display: isNonMobile ? "flex" : "block",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default
      }}
    >
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userRole={userRole}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isNonMobile ? `calc(100% - ${isSidebarOpen ? "250px" : "0px"})` : "100%",
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isNonMobile && isSidebarOpen ? "0px" : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;