// import React from 'react'
// import {
//     Box,
//     Divider,
//     Drawer,
//     IconButton,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemIcon,
//     ListItemText,
//     Typography,
//     useTheme
// } from "@mui/material"
// import {
//     SettingsOutlined,
//     ChevronLeft,
//     ChevronLeftOutlined,
//     ChevronRightOutlined,
//     HomeOutlined,
//     // ShoppingCartOutlined,
//     // Groups2Outlined,
//     // ReceiptLongOutlined,
//     // PublicOutlined,
//     // PointOfSaleOutlined,
//     // TodayOutlined,
//     // CalendarMonthOutlined,
//     // AdminPanelSettingsOutlined,
//     // TrendingUpOutlined,
//     // PieChartOutlined,
//     BarChartOutlined,
//     SsidChartOutlined,
//     DescriptionOutlined,
//     AssignmentIndOutlined,
//     OutlinedFlag
// } from "@mui/icons-material"
// import { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom' 
// // import profileImage from "../assets/profile.png"
// import FlexBetween from './FlexBetween'

// const navItems = [
//     {
//         text: "Dashboard",
//         icon: <HomeOutlined />
//     },
//     {
//         text: "Fish Supply",
//         icon: <BarChartOutlined/>
//     },
//     {
//         text: "Market Supply",
//         icon: <SsidChartOutlined/>
//     },
//     {
//         text: "Permit Application",
//         icon: <AssignmentIndOutlined />
//     },
//     {
//         text: "Document Management",
//         icon: <DescriptionOutlined />
//     },
//     {
//         text: "Generate Reports",
//         icon: <OutlinedFlag />
//     },
// ]
// const Sidebar = ({
//     drawerWidth,
//     isSidebarOpen,
//     setIsSidebarOpen,
//     isNonMobile,
//     userRole, // Pass the user role as a prop
//   }) => {
//     const { pathname } = useLocation();
//     const [active, setActive] = useState("");
//     const navigate = useNavigate();
//     const theme = useTheme();
  
//     // Role-based filtering of nav items
//     const filteredNavItems = navItems.filter((item) => {
//       if (userRole === "LGU") {
//         // LGU can access only specific items
//         return ["Fish Supply", "Market Supply", "Document Management"].includes(item.text);
//       }
//       // BFAR or any other role can access all items
//       return true;
//     });
  
//     useEffect(() => {
//       setActive(pathname.substring(1));
//     }, [pathname]);
  
//     return (
//       <Box component="nav">
//         {isSidebarOpen && (
//           <Drawer
//             open={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             variant="persistent"
//             anchor="left"
//             sx={{
//               width: drawerWidth,
//               "& .MuiDrawer-paper": {
//                 color: theme.palette.secondary[200],
//                 backgroundColor: theme.palette.background.alt,
//                 boxSizing: "border-box",
//                 borderWidth: isNonMobile ? 0 : "2px",
//                 width: drawerWidth,
//               },
//             }}
//           >
//             <Box width="100%">
//               <Box m="2.5rem 4rem 1rem 3rem">
//                 <FlexBetween color={theme.palette.secondary.main}>
//                   <Typography variant="h4" fontWeight="bold" fontSize="2rem">
//                     SEASYNC
//                   </Typography>
//                   {!isNonMobile && (
//                     <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//                       <ChevronLeft />
//                     </IconButton>
//                   )}
//                 </FlexBetween>
//               </Box>
//               <List>
//                 {filteredNavItems.map(({ text, icon }) => {
//                   const lcText = text.toLowerCase();
//                   return (
//                     <ListItem key={text} disablePadding>
//                       <ListItemButton
//                         onClick={() => {
//                           const formattedLcText = lcText.replace(/\s+/g, "-").toLowerCase();
//                           navigate(`/${formattedLcText}`);
//                           setActive(lcText);
//                         }}
//                         sx={{
//                           backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
//                           color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100],
//                         }}
//                       >
//                         <ListItemIcon
//                           sx={{
//                             ml: "2rem",
//                             color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200],
//                           }}
//                         >
//                           {icon}
//                         </ListItemIcon>
//                         <ListItemText primary={text} />
//                         {active === lcText && <ChevronRightOutlined sx={{ ml: "auto" }} />}
//                       </ListItemButton>
//                     </ListItem>
//                   );
//                 })}
//               </List>
//             </Box>
//           </Drawer>
//         )}
//       </Box>
//     );
//   };
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   IconButton,
//   BottomNavigation,
//   BottomNavigationAction,
//   useTheme,
// } from "@mui/material";
// import {
//   ChevronLeft,
//   HomeOutlined,
//   BarChartOutlined,
//   SsidChartOutlined,
//   AssignmentIndOutlined,
//   DescriptionOutlined,
//   OutlinedFlag,
//   AssignmentOutlined,
//   Engineering,
//   AddBusiness,
// } from "@mui/icons-material";
// import { useLocation, useNavigate } from "react-router-dom";
// import FlexBetween from "./FlexBetween";

// const navItems = [
//   { text: "Dashboard", icon: <HomeOutlined /> },
//   { text: "Fish Supply", icon: <BarChartOutlined /> },
//   { text: "Maintenance", icon: <Engineering /> },
//   { text: "Market Supply", icon: <SsidChartOutlined /> },
//   { text: "Transport Permit", icon: <AssignmentIndOutlined /> },
//   { text: "Auxiliary Invoice", icon: <AssignmentOutlined /> },
//   { text: "Fish Data", icon: <AddBusiness /> },
//   { text: "Invoice Management", icon: <DescriptionOutlined /> },
//   { text: "LTP List", icon: <DescriptionOutlined /> },
//   { text: "Generate Reports", icon: <OutlinedFlag /> },
// ];

// const Sidebar = ({
//   drawerWidth,
//   isSidebarOpen,
//   setIsSidebarOpen,
//   isNonMobile,
//   userRole, // Pass userRole here
// }) => {
//   const { pathname } = useLocation();
//   const [active, setActive] = useState("");
//   const navigate = useNavigate();
//   const theme = useTheme();

//   // Role-based filtering of nav items
//   const filteredNavItems = navItems.filter((item) => {
//     if (userRole === "LGU") {
//       return [
//         "Fish Supply",
//         "Market Supply",
//         "Auxiliary Invoice",
//         "Invoice Management",
//         "Fish Data",
//       ].includes(item.text);
//     }
//     if (userRole === "BFAR") {
//       return [
//         "Dashboard",
//         "Fish Supply",
//         "Maintenance",
//         "Market Supply",
//         "Transport Permit",
//         "LTP List",
//         "Generate Reports",
//       ].includes(item.text);
//     }
//     return false; // Default: No access
//   });

//   useEffect(() => {
//     setActive(pathname.substring(1));
//   }, [pathname]);

//   const handleNavigation = (text) => {
//     const lcText = text.toLowerCase().replace(/\s+/g, "-");
//     navigate(`/${lcText}`);
//     setActive(lcText);
//   };

//   return (
//     <Box component="nav">
//       {isNonMobile ? (
//         // Desktop Sidebar
//         isSidebarOpen && (
//           <Drawer
//             open={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             variant="persistent"
//             anchor="left"
//             sx={{
//               width: drawerWidth,
//               "& .MuiDrawer-paper": {
//                 color: theme.palette.secondary[200],
//                 backgroundColor: theme.palette.background.alt,
//                 boxSizing: "border-box",
//                 width: drawerWidth,
//               },
//             }}
//           >
//             <Box width="100%">
//               {/* Header */}
//               <Box m="2.5rem 4rem 1rem 3rem">
//                 <FlexBetween color={theme.palette.secondary.main}>
//                   <Typography variant="h4" fontWeight="bold" fontSize="2rem">
//                     SEASYNC
//                   </Typography>
                  
//                 </FlexBetween>
//               </Box>
//               {/* Navigation List */}
//               <List>
//                 {filteredNavItems.map(({ text, icon }) => {
//                   const lcText = text.toLowerCase();
//                   return (
//                     <ListItem key={text} disablePadding>
//                       <ListItemButton
//                         onClick={() => handleNavigation(text)}
//                         sx={{
//                           backgroundColor:
//                             active === lcText
//                               ? theme.palette.secondary[300]
//                               : "transparent",
//                           color:
//                             active === lcText
//                               ? theme.palette.primary[600]
//                               : theme.palette.secondary[100],
//                         }}
//                       >
//                         <ListItemIcon
//                           sx={{
//                             ml: "2rem",
//                             color:
//                               active === lcText
//                                 ? theme.palette.primary[600]
//                                 : theme.palette.secondary[200],
//                           }}
//                         >
//                           {icon}
//                         </ListItemIcon>
//                         <ListItemText primary={text} />
//                       </ListItemButton>
//                     </ListItem>
//                   );
//                 })}
//               </List>
//             </Box>
//           </Drawer>
//         )
//       ) : (
//         // Mobile Bottom Navigation
//         <BottomNavigation
//           value={active}
//           onChange={(event, newValue) => {
//             handleNavigation(newValue);
//           }}
//           sx={{
//             position: "fixed",
//             bottom: 0,
//             left: 0,
//             width: "100%",
//             backgroundColor: theme.palette.background.alt,
//             zIndex: 1300,
//           }}
//         >
//           {filteredNavItems.map(({ text, icon }) => (
//             <BottomNavigationAction
//               key={text}
//               value={text.toLowerCase().replace(/\s+/g, "-")}
//               icon={icon}
//               sx={{
//                 color:
//                   active === text.toLowerCase().replace(/\s+/g, "-")
//                     ? theme.palette.primary[600]
//                     : theme.palette.secondary[200],
//                 minWidth: "48px", // Reduce the width of each action
//                 padding: "4px", // Reduce the padding
//                 "& .MuiBottomNavigationAction-label": {
//                   fontSize: "10px", // Adjust font size for labels
//                   color:
//                       active === text.toLowerCase().replace(/\s+/g, "-")
//                         ? theme.palette.primary[600]
//                         : theme.palette.secondary[200],
//                 },
//                 "& .MuiSvgIcon-root": {
//                   fontSize: "20px", // Adjust icon size
//                   color:
//                       active === text.toLowerCase().replace(/\s+/g, "-")
//                         ? theme.palette.primary[100] // Active icon color
//                         : theme.palette.secondary[100],
//                 },
//               }}
//             />
//           ))}
//         </BottomNavigation>
//       )}
//     </Box>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  HomeOutlined,
  BarChartOutlined,
  SsidChartOutlined,
  AssignmentIndOutlined,
  DescriptionOutlined,
  OutlinedFlag,
  AssignmentOutlined,
  Engineering,
  AddBusiness,
  LogoutOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  { text: "Dashboard", icon: <HomeOutlined /> },
  { text: "Fish Supply", icon: <BarChartOutlined /> },
  { text: "Maintenance", icon: <Engineering /> },
  { text: "Market Supply", icon: <SsidChartOutlined /> },
  { text: "Transport Permit", icon: <AssignmentIndOutlined /> },
  { text: "Auxiliary Invoice", icon: <AssignmentOutlined /> },
  { text: "Fish Data", icon: <AddBusiness /> },
  { text: "Invoice Management", icon: <DescriptionOutlined /> },
  { text: "LTP List", icon: <DescriptionOutlined /> },
  { text: "Generate Reports", icon: <OutlinedFlag /> },
];

  

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
  userRole,
  onLogout, // Add onLogout prop
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    // 1. Clear the authentication token from localStorage
    localStorage.removeItem('token');
    // or if using session storage
    // sessionStorage.removeItem('token');

    // 2. Clear any user data from state
    // If using Redux:
    // dispatch(clearUserData());
    // If using local state:
    // setUser(null);

    // 3. Redirect to login page
    navigate('/login');
  };

  const filteredNavItems = navItems.filter((item) => {
    if (userRole === "LGU") {
      return [
        "Fish Supply",
        "Market Supply",
        "Auxiliary Invoice",
        "Invoice Management",
        "Fish Data",
      ].includes(item.text);
    }
    if (userRole === "BFAR") {
      return [
        "Dashboard",
        "Fish Supply",
        "Maintenance",
        "Market Supply",
        "Transport Permit",
        "LTP List",
        "Generate Reports",
      ].includes(item.text);
    }
    return false;
  });

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleNavigation = (text) => {
    if (text === 'logout') {
      handleLogout();
      return;
    }
    const lcText = text.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${lcText}`);
    setActive(lcText);
  };

  return (
    <Box component="nav">
      {isNonMobile ? (
        isSidebarOpen && (
          <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            variant="persistent"
            anchor="left"
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                color: theme.palette.secondary[200],
                backgroundColor: theme.palette.background.alt,
                boxSizing: "border-box",
                width: drawerWidth,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              },
            }}
          >
            {/* Main content wrapper */}
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Header */}
              <Box m="2.5rem 4rem 1rem 3rem">
                <FlexBetween color={theme.palette.secondary.main}>
                  <Typography variant="h4" fontWeight="bold" fontSize="2rem">
                    SEASYNC
                  </Typography>
                </FlexBetween>
              </Box>

              {/* Navigation List */}
              <List sx={{ flex: 1, overflowY: "auto" }}>
                {filteredNavItems.map(({ text, icon }) => {
                  const lcText = text.toLowerCase();
                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        onClick={() => handleNavigation(text)}
                        sx={{
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>

              {/* Logout Button */}
              <Box sx={{ p: 2}}>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    color: theme.palette.secondary[100],
                    '&:hover': {
                      backgroundColor: theme.palette.secondary[300],
                      color: theme.palette.primary[600],
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ml: "2rem",
                      color: theme.palette.secondary[200],
                    }}
                  >
                    <LogoutOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </Box>
            </Box>
          </Drawer>
        )
      ) : (
        <BottomNavigation
          value={active}
          onChange={(event, newValue) => {
            handleNavigation(newValue);
          }}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: theme.palette.background.alt,
            zIndex: 1300,
          }}
        >
          {filteredNavItems.map(({ text, icon }) => (
            <BottomNavigationAction
              key={text}
              value={text.toLowerCase().replace(/\s+/g, "-")}
              icon={icon}
              sx={{
                color:
                  active === text.toLowerCase().replace(/\s+/g, "-")
                    ? theme.palette.primary[600]
                    : theme.palette.secondary[200],
                minWidth: "48px",
                padding: "4px",
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "10px",
                  color:
                    active === text.toLowerCase().replace(/\s+/g, "-")
                      ? theme.palette.primary[600]
                      : theme.palette.secondary[200],
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "20px",
                  color:
                    active === text.toLowerCase().replace(/\s+/g, "-")
                      ? theme.palette.primary[100]
                      : theme.palette.secondary[100],
                },
              }}
            />
          ))}
          {/* Add Logout to bottom navigation */}
          <BottomNavigationAction
            value="logout"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            sx={{
              color: theme.palette.secondary[200],
              minWidth: "48px",
              padding: "4px",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "10px",
                color: theme.palette.secondary[200],
              },
              "& .MuiSvgIcon-root": {
                fontSize: "20px",
                color: theme.palette.secondary[100],
              },
            }}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

export default Sidebar;