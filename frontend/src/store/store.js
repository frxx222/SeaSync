// import { create } from 'zustand';  // Import as a named export

// export const useAuthStore = create((set) => ({
//     auth: {
//         username: '',
//         active: false
//     },
//     setUsername : (name) => set((state) => ({ auth: { ...state.auth, username: name }}))
// }));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// // Store definition with persist middleware
// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       auth: {
//         username: '',
//         role: '', // Role will be either 'LGU' or 'BFAR'
//       },
//       setUsername: (name) =>
//         set((state) => ({
//           auth: { ...state.auth, username: name },
//         })),
//       setRole: (role) =>
//         set((state) => ({
//           auth: { ...state.auth, role },
//         })),
//     }),
//     {
//       name: 'auth-storage', // Key used in localStorage
//       partialize: (state) => ({ auth: state.auth }), // Save only the `auth` object
//     }
//   )
// );
export const useAuthStore = create(
  persist(
    (set) => ({
      auth: {
        username: '',
        role: '',
        token: null
      },
      setToken: (token) =>
        set((state) => ({
          auth: { ...state.auth, token },
        })),
      setUsername: (name) =>
        set((state) => ({
          auth: { ...state.auth, username: name },
        })),
      setRole: (role) =>
        set((state) => ({
          auth: { ...state.auth, role },
        })),
      logout: () =>
        set({
          auth: {
            username: '',
            role: '',
            token: null
          },
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ auth: state.auth }),
    }
  )
);