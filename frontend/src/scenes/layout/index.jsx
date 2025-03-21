// import React, { useState } from 'react';
// import { Box, useMediaQuery } from "@mui/material";
// import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation
// import Navbar from '../../components/Navbar';
// import Sidebar from '../../components/Sidebar';

// const Layout = () => {
//   const isNonMobile = useMediaQuery("(min-width: 600px)");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Get current location (route)
//   const location = useLocation();

//   // Define routes where you don't want to show Sidebar and Navbar
//   const hideLayoutRoutes = ['/register', '/login', '/Register' ];

//   // Check if the current path is in the list of routes where layout is hidden
//   const isLayoutHidden = hideLayoutRoutes.includes(location.pathname);

//   return (
//     <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
//       {!isLayoutHidden && (
//         <Sidebar
//           isNonMobile={isNonMobile}
//           drawerWidth="250px"
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />
//       )}
//       <Box>
//         {!isLayoutHidden && (
//           <Navbar
//             isSidebarOpen={isSidebarOpen}
//             setIsSidebarOpen={setIsSidebarOpen}
//           />
//         )}
//         {/* This Outlet will render the child component for the current route */}
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Layout;

import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const Layout = ({ userRole }) => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up('sm'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Define routes where Sidebar should be hidden
  const hideLayoutRoutes = ['/register', '/login', '/reset'];
  const isLayoutHidden = hideLayoutRoutes.includes(location.pathname);

  return (
    <Box 
      sx={{
        display: isNonMobile ? "flex" : "block",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default
      }}
    >
      {!isLayoutHidden && (
        <Sidebar
          isNonMobile={isNonMobile}
          drawerWidth="250px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          userRole={userRole}
        />
      )}
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

export default Layout;