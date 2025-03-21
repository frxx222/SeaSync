// // context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// // Constants for roles
// export const ROLES = {
//   BFAR: 'BFAR',
//   LGU: 'LGU'
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUserData = async (token) => {
//     try {
//       const response = await fetch('/api/user/me', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       const userData = await response.json();
//       if (userData) {
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       logout(); // Clear invalid session
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetchUserData(token);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });
      
//       if (!response.ok) {
//         throw new Error('Login failed');
//       }

//       const data = await response.json();
      
//       if (data.token) {
//         localStorage.setItem('token', data.token);
//         setUser(data.user);
//         return { success: true };
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       return {
//         success: false,
//         error: error.message || 'An error occurred during login'
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   // Role checking utilities
//   const isBFAR = () => user?.role === ROLES.BFAR;
//   const isLGU = () => user?.role === ROLES.LGU;
//   const hasRole = (role) => user?.role === role;

//   // Get auth headers utility
//   const getAuthHeaders = () => ({
//     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     'Content-Type': 'application/json',
//   });

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isBFAR,
//     isLGU,
//     hasRole,
//     getAuthHeaders,
//   };

//   if (loading) {
//     // You can return a loading spinner here if needed
//     return null;
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Usage example:
// /*
// import { useAuth, ROLES } from './context/AuthContext';

// function MyComponent() {
//   const { user, isBFAR, isLGU, hasRole } = useAuth();

//   if (isBFAR()) {
//     // Show BFAR specific content
//   }

//   if (isLGU()) {
//     // Show LGU specific content
//   }

//   // Or check role explicitly
//   if (hasRole(ROLES.BFAR)) {
//     // BFAR only content
//   }
// }
// */