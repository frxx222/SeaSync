// import React from 'react';
// import { 
//     Menu as MenuIcon, 
//     Search, 
//     SettingsOutlined, 
//     DarkModeOutlined, 
//     LightModeOutlined 
// } from "@mui/icons-material";
// import FlexBetween from '../components/FlexBetween';
// import { useDispatch } from 'react-redux';
// import { setMode } from '../states';
// import { AppBar, IconButton, Toolbar, useTheme, InputBase } from '@mui/material';

// const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//     const dispatch = useDispatch();
//     const theme = useTheme();

//     return (
//         <AppBar
//             sx={{
//                 position: "sticky",
//                 background: "none",
//                 boxShadow: "none",
//                 right: "0",
//             }}
//         >
//             <Toolbar sx={{ justifyContent: "space-between" }}>
//                 {/* Left */}
//                 <FlexBetween>
//                     <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//                         <MenuIcon />
//                     </IconButton>
//                     <FlexBetween
//                         backgroundColor={theme.palette.background.alt}
//                         borderRadius="9px"
//                         gap="3rem"
//                         p="0.1rem 1.5rem"
//                     >
//                         <InputBase placeholder='Search...' />
//                         <IconButton>
//                             <Search />
//                         </IconButton>
//                     </FlexBetween>
//                 </FlexBetween>
//                 {/* Right */}
//                 <FlexBetween gap="1.5rem">
//                     <IconButton onClick={() => dispatch(setMode())}>
//                         {theme.palette.mode === "dark" ? (
//                             <DarkModeOutlined sx={{ fontSize: "25px" }} />
//                         ) : (
//                             <LightModeOutlined sx={{ fontSize: "25px" }} />
//                         )}
//                     </IconButton>
//                     <IconButton>
//                         <SettingsOutlined sx={{ fontSize: "25px" }} />
//                     </IconButton>
//                 </FlexBetween>
//             </Toolbar>
//         </AppBar>
//     );
// };

// export default Navbar;

// import React from 'react';
// import { 
//     Menu as MenuIcon, 
//     Search, 
//     SettingsOutlined, 
//     DarkModeOutlined, 
//     LightModeOutlined 
// } from "@mui/icons-material";
// import FlexBetween from '../components/FlexBetween';
// import { useDispatch } from 'react-redux';
// import { setMode } from '../states';
// import { AppBar, IconButton, Toolbar, useTheme, InputBase } from '@mui/material';

// const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//     const dispatch = useDispatch();
//     const theme = useTheme();

//     return (
//         <AppBar
//             sx={{
//                 position: "fixed",
//                 top: 0,
//                 right: 0,
//                 width: "250px", // Adjust as needed
//                 background: "none",
//                 boxShadow: "none",
//                 padding: "10px",
//             }}
//         >
//             <Toolbar sx={{ justifyContent: "space-between", flexDirection: "column" }}>
//                 {/* Left */}
//                 {/* <FlexBetween>
//                     <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//                         <MenuIcon />
//                     </IconButton>
//                     <FlexBetween
//                         backgroundColor={theme.palette.background.alt}
//                         borderRadius="9px"
//                         gap="3rem"
//                         p="0.1rem 1.5rem"
//                     >
//                         <InputBase placeholder='Search...' />
//                         <IconButton>
//                             <Search />
//                         </IconButton>
//                     </FlexBetween>
//                 </FlexBetween> */}
//                 {/* Right */}
//                 <FlexBetween gap="1.5rem">
//                     <IconButton onClick={() => dispatch(setMode())}>
//                         {theme.palette.mode === "dark" ? (
//                             <DarkModeOutlined sx={{ fontSize: "25px" }} />
//                         ) : (
//                             <LightModeOutlined sx={{ fontSize: "25px" }} />
//                         )}
//                     </IconButton>
//                     <IconButton>
//                         <SettingsOutlined sx={{ fontSize: "25px" }} />
//                     </IconButton>
//                 </FlexBetween>
//             </Toolbar>
//         </AppBar>
//     );
// };

// export default Navbar;
