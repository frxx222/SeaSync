import { useState, useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { themeSettings } from './theme';
import MainLayout from './scenes/layout/MainLayout';
import AuthLayout from './scenes/AuthLayout/AuthLayout';
import { useAuthStore } from './store/store';

// Import all your components
import Register from './components/register';
import Login from './components/login';
import Reset from './components/reset';
import Dashboard from './scenes/dashboard';
import Market from './scenes/marketData';
import Charts from './scenes/charts';
import Invoice from './scenes/invoice';
import Fish from './scenes/fishApp';
import Auxiliary from './scenes/auxiliary';
import Document from './scenes/document';
import Reports from './scenes/reports';
import Maintenance from './scenes/maintenance';
import Permit from './scenes/application';


// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = useAuthStore((state) => state.auth.role);
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'LGU' ? '/fish-supply' : '/dashboard'} replace />;
  }

  return element;
};

function App() {
  const mode = useSelector((state) => state.global.mode);
  const userRole = useAuthStore((state) => state.auth.role);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset" element={<Reset />} />
            </Route>

            {/* Main Layout with Protected Routes */}
            <Route element={<MainLayout />}>
              {/* BFAR-only routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<Dashboard />}
                    allowedRoles={['BFAR']}
                  />
                }
              />
              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute
                    element={<Maintenance />}
                    allowedRoles={['BFAR']}
                  />
                }
              />
              <Route
                path="/transport-permit"
                element={
                  <ProtectedRoute
                    element={<Permit />}
                    allowedRoles={['BFAR']}
                  />
                }
              />
              <Route
                path="/ltp-list"
                element={
                  <ProtectedRoute
                    element={<Document />}
                    allowedRoles={['BFAR']}
                  />
                }
              />
              <Route
                path="/generate-reports"
                element={
                  <ProtectedRoute
                    element={<Reports />}
                    allowedRoles={['BFAR']}
                  />
                }
              />

              {/* Shared routes */}
              <Route
                path="/market-supply"
                element={
                  <ProtectedRoute
                    element={<Market />}
                    allowedRoles={['BFAR', 'LGU']}
                  />
                }
              />
              <Route
                path="/fish-supply"
                element={
                  <ProtectedRoute
                    element={<Charts />}
                    allowedRoles={['BFAR', 'LGU']}
                  />
                }
              />

              {/* LGU-only routes */}
              <Route
                path="/auxiliary-invoice"
                element={
                  <ProtectedRoute
                    element={<Invoice />}
                    allowedRoles={['LGU']}
                  />
                }
              />
              <Route
                path="/fish-data"
                element={
                  <ProtectedRoute
                    element={<Fish />}
                    allowedRoles={['LGU']}
                  />
                }
              />
              <Route
                path="/invoice-management"
                element={
                  <ProtectedRoute
                    element={<Auxiliary />}
                    allowedRoles={['LGU']}
                  />
                }
              />
            </Route>

            {/* Default Routes */}
            <Route
              path="/"
              element={
                !userRole ? (
                  <Navigate to="/login" replace />
                ) : userRole === "LGU" ? (
                  <Navigate to="/fish-supply" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;








//reyal

// import { useState, useMemo } from 'react';
// import { CssBaseline, ThemeProvider } from '@mui/material';
// import { createTheme } from '@mui/material/styles';
// import { useSelector } from 'react-redux';
// import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
// import { themeSettings } from './theme';
// import Layout from './scenes/layout';
// import AuthLayout from './scenes/AuthLayout/AuthLayout';
// import Register from './components/register';
// import Dashboard from './scenes/dashboard';
// import Market from './scenes/marketData';
// import Login from './components/login';
// import Permit from './scenes/application';
// import Invoice from './scenes/invoice';
// import Document from './scenes/document';
// import Fish from './scenes/fishApp';
// import Auxiliary from './scenes/auxiliary';
// import Reset from './components/reset';
// import Charts from './scenes/charts';
// import Reports from './scenes/reports';
// import Maintenance from './scenes/maintenance';
// import { useAuthStore } from './store/store';

// function App() {
//   const mode = useSelector((state) => state.global.mode);
//   const userRole = useAuthStore((state) => state.auth.role);
//   const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

//   return (
//     <div className="app">
//       <BrowserRouter>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <Routes>
//             <Route element={<Layout userRole={userRole} />}>
//               {/* Conditionally render routes based on role */}
//               {userRole === 'BFAR' && <Route path="/dashboard" element={<Dashboard />} />}
//               <Route path="/market-supply" element={<Market />} />
//               <Route path="/fish-supply" element={<Charts />} />
//               <Route path="/auxiliary-invoice" element={<Invoice />} />
//               <Route path="/fish-data" element={<Fish />} />
//               <Route path="/invoice-management" element={<Auxiliary />} />
//               {userRole === 'BFAR' && <Route path="/maintenance" element={<Maintenance />} />}
//               {userRole === 'BFAR' && <Route path="/ltp-list" element={<Document />} />}
//               {userRole === 'BFAR' && <Route path="/generate-reports" element={<Reports />} />}
//               {userRole === 'BFAR' && <Route path="/transport-permit" element={<Permit />} />}
//               <Route path="/" element={<Navigate to="/register" replace />} />
//             </Route>
//             <Route element={<AuthLayout />}>
//               <Route path="/register" element={<Register />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/reset" element={<Reset />} />
//             </Route>
//             {/* Fallback for undefined routes */}
//             <Route
//               path="*"
//               element={
//                 userRole === "LGU" ? (
//                   <Navigate to="/fish-supply" replace />
//                 ) : (
//                   <h1>404 - Page Not Found</h1>
//                 )
//               }
//             />
//           </Routes>
//         </ThemeProvider>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
