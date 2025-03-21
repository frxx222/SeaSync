import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useAuthStore } from '../store/store';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',  // Your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function getUsername() {
    const token = useAuthStore.getState().auth.token;
    if (!token) return Promise.reject("Cannot find Token");
    let decode = jwtDecode(token);
    return decode;
}

// Authenticate user
export async function authenticate(username) {
    try {
        return await axiosInstance.post('/api/authenticate', { username });
    } catch {
        return { error: "Username doesn't exist..." };
    }
}

// In api.js
axiosInstance.interceptors.request.use(
    (config) => {
      // Change this to access from Zustand store instead of localStorage
      const token = useAuthStore.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// Add response interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // If unauthorized, log out user
            useAuthStore.getState().logout();
            // You might want to redirect to login page here
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


// Get user details
export async function getUser({ username }) {
    try {
        const { data } = await axiosInstance.get(`/api/user/${username}`);
        return { data };
    } catch  {
        return { error: "Password Doesn't Match.." };
    }
}

// Register user
// export async function registerUser(credentials) {
//     try {
//         console.log("Credentials being sent:", credentials);  // Log credentials
//         const { data: { msg }, status } = await axiosInstance.post('/api/register', credentials);

//         let { username, email } = credentials;

//         // Send email if registration was successful
//         if (status === 201) {
//             await axiosInstance.post('/api/registerMail', { username, userEmail: email, text: msg });
//         }
//         return Promise.resolve(msg);
//     } catch (error) {
//         console.error("Error during registration:", error);  // Log error
//         return Promise.reject({ error });
//     }
// }

export async function registerUser(credentials) {
    try {
        console.log("Credentials being sent:", credentials);  // Log credentials
        const { data: { msg } } = await axiosInstance.post('/api/register', credentials);

        // Removed email-related logic since it's not needed
        return Promise.resolve(msg);
    } catch (error) {
        console.error("Error during registration:", error);  // Log error
        return Promise.reject({ error });
    }
}



// Login user
// export async function verifyPassword({ username, password }) {
//     try {
//         if (username) {
//             const { data } = await axiosInstance.post('/api/login', { username, password });
//             return Promise.resolve({ data });
//         }
//     } catch (error) {
//         return Promise.reject({ error: "Password Doesn't Match..." });
//     }
// }
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axiosInstance.post('/api/login', { username, password });
            // Set the token in the store
            useAuthStore.getState().setToken(data.token);
            return Promise.resolve({ data });
        }
    } catch  {
        return Promise.reject({ error: "Password Doesn't Match..." });
    }
}

// Update user profile
export async function updateUser(response) {
    try {
        const token = await localStorage.getItem('token');
        const data = await axiosInstance.put('/api/updateuser', response, { 
            headers: { "Authorization": `Bearer ${token}` }
        });

        return Promise.resolve({ data });
    } catch  {
        return Promise.reject({ error: "Couldn't Update Profile..." });
    }
}

// Generate OTP
export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get('/api/generateOTP', { params : { username }});

        // send mail with the OTP
        if(status === 201){
            let { data : { email }} = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

// Verify OTP
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axiosInstance.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };
    } catch (error) {
        return Promise.reject(error);
    }
}

// Reset password
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axiosInstance.put('/api/resetPassword', { username, password });
        console.log('Response:', { data, status });
        return Promise.resolve({ data, status });
    } catch (error) {
        console.error('Reset Password Error:', error.response?.data || error.message);
        return Promise.reject({ error });
    }
}

// In states/api.js

// Get the security question for a user
export async function getSecurityQuestion(username) {
    try {
      const { data } = await axiosInstance.post('/api/getSecurityQuestion', { username });
      return data; // Expecting { securityQuestion: "Your question?" }
    } catch (error) {
      return Promise.reject({
        error: error.response?.data?.error || 'Error retrieving security question',
      });
    }
  }
  
  // Reset password using the security question answer
  export async function resetPasswordSecurity({ username, securityAnswer, newPassword }) {
    try {
      const { data } = await axiosInstance.put('/api/resetPasswordSecurity', {
        username,
        securityAnswer,
        newPassword,
      });
      return data; // Expecting a success message
    } catch (error) {
      return Promise.reject({
        error: error.response?.data?.error || 'Error resetting password',
      });
    }
  }
  


// Fetch market data
export const getMarketData = async () => {
    try {
      const response = await axiosInstance.get('/api/data');
      console.log('Market data response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching market data:", error);
      throw error;
    }
  };

// Permit functions (get, post, update, delete)
export const getPermit = async () => {
    try {
        const response = await axiosInstance.get('/api/permit');
        return response.data;
    } catch (error) {
        console.error("Error fetching permit data:", error);
        throw error;
    }
};

// export const postPermit = async (permitData) => {
//     try {
//         const response = await axiosInstance.post('/api/permit-data', permitData);
//         return response.data;
//     } catch (error) {
//         console.error('Error posting permit:', error);
//         throw error;
//     }
// };

// export const updatePermitData = async (id, updatedPermitData) => {
//     try {
//         const response = await axiosInstance.put(`/api/permit-data/${id}`, updatedPermitData);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating permit data:', error);
//         throw error;
//     }
// };

export const postPermit = async (permitData) => {
    try {
        const response = await axiosInstance.post('/api/permit-data', permitData); // Adjusted endpoint
        return response.data;
    } catch (error) {
        console.error('Error posting permit:', error);
        throw error;
    }
};

export const updatePermitData = async (id, updatedPermitData) => {
    try {
        const response = await axiosInstance.put(`/api/permit-data/${id}`, updatedPermitData);
        return response.data;
    } catch (error) {
        console.error('Error updating permit:', error);
        throw error;
    }
};


export const deletePermitData = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/permit-data/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting permit data:', error);
        throw error;
    }
};

// Update permit status
export const updateStatus = async (record, status) => {
    try {
        const response = await axiosInstance.post('/api/changeAccountStatus', {
            permitId: record._id,
            status
        });
        return response.data;
    } catch (error) {
        console.error('Error updating permit status:', error);
        throw error;
    }
};

// Fetch supply data (daily/monthly)
export const fetchSupplyData = async (view) => {
    try {
        const endpoint = view === "daily" ? "/api/supply/daily" : "/api/supply/monthly";
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error fetching supply data:", error);
        throw error;
    }
};

// Fetch additional data
export const fetchData = async () => {
    try {
        const response = await axiosInstance.get('/api/invoice');
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetchPermits = async () => {
    try {
        const response = await axiosInstance.get('/api/permit');
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

//invoice

// Permit functions (get, post, update, delete)
export const getInvoice = async () => {
    try {
        const response = await axiosInstance.get('/api/invoice');
        console.log('API Response:', response.data); // Add this to debug
        return response.data;
    } catch (error) {
        console.error("Error fetching permit data:", error);
        throw error;
    }
};




export const postInvoice = async (invoiceData) => {
    try {
        const token = useAuthStore.getState().auth.token;
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Set the authorization header
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axiosInstance.post('/api/invoice-data', invoiceData, config); // Adjusted endpoint
        return response.data;
    } catch (error) {
        console.error('Error posting permit:', error);
        throw error;
    }
};

export const updateInvoiceData = async (id, updatedInvoiceData) => {
    try {
        const response = await axiosInstance.put(`/api/invoice-data/${id}`, updatedInvoiceData);
        return response.data;
    } catch (error) {
        console.error('Error updating permit:', error);
        throw error;
    }
};


export const deleteInvoiceData = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/invoice-data/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting permit data:', error);
        throw error;
    }
};

// Update permit status
export const updateStatusInvoice = async (record, status) => {
    try {
        const response = await axiosInstance.post('/api/changeAccountStatusInvoice', {
            invoiceId: record._id,
            status
        });
        return response.data;
    } catch (error) {
        console.error('Error updating permit status:', error);
        throw error;
    }
};


export const postData = async (formData, id = null) => {
    try {
        // Retrieve token from auth store
        const token = useAuthStore.getState().auth.token;
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Set the authorization header
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        // Post data to the server with auth header
        const response = await axiosInstance.post('/api/market-data', formData, config);

        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);

        // Handle unauthorized errors
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        throw error;
    }
};

export const deleteData = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/data/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};

// export const getData = async () => {
//     try {
//         const response = await axiosInstance.get('/api/data');
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching permit data:", error);
//         throw error;
//     }
// };
// In api.js
export const getData = async () => {
    try {
      const response = await axiosInstance.get('/api/data');
      console.log('API Response:', response.data); // Add this to debug
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };
// export async function getData() {
//     try {
//         const user = await getUsername();
//         const { data } = await axiosInstance.get('/api/data', {
//             params: {
//                 role: user.role,
//                 municipality: user.role === 'LGU' ? user.username : null
//             }
//         });
//         return data;
//     } catch (error) {
//         console.error('Error fetching fish data:', error);
//         throw error;
//     }
// }

// Post new fish data
// export async function postData(fishData) {
//     try {
//         const user = await getUsername();
//         const payload = {
//             ...fishData,
//             adminRole: user.role === 'LGU' ? user.username : 'BFAR',
//             applicationData: {
//                 ...fishData,
//                 submittedBy: user.username,
//                 submittedAt: new Date()
//             }
//         };
        
//         const { data } = await axiosInstance.post('/api/market-data', payload);
//         return data;
//     } catch (error) {
//         console.error('Error posting fish data:', error);
//         throw error;
//     }
// }

// export const deleteData = async (id) => {
//     try {
//         const response = await axiosInstance.delete(`/api/market-data/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting permit data:', error);
//         throw error;
//     }
// };

// export const postData = async (fishData) => {
//     try {
//         // Get user ID from localStorage or auth state
//         const userId = localStorage.getItem('userId');
        
//         // Add userId to the fish data
//         const dataWithUser = {
//             ...fishData,
//             userId: userId
//         };
        
//         const response = await axiosInstance.post('/api/market-data', dataWithUser, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error posting permit:', error);
//         throw error;
//     }
// };

// export const getData = async () => {
//     try {
//         // Get user ID from localStorage or auth state
//         const userId = localStorage.getItem('userId');
        
//         const response = await axiosInstance.get(`/api/data`, {
//             params: { userId }, // Add userId as query parameter
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//         });
        
//         // Filter data for current user
//         const userSpecificData = response.data.filter(item => item.userId === userId);
//         return userSpecificData;
//     } catch (error) {
//         console.error("Error fetching permit data:", error);
//         throw error;
//     }
// };

// export const deleteData = async (id) => {
//     try {
//         const userId = localStorage.getItem('userId');
        
//         const response = await axiosInstance.delete(`/api/market-data/${id}`, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             data: { userId } // Include userId in delete request
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting permit data:', error);
//         throw error;
//     }
// };



export const getDemand = async () => {
    try {
        const response = await axiosInstance.get('/api/local-demand');
        return response.data;
    } catch (error) {
        console.error("Error fetching local demand data:", error);
        throw error;
    }
};

export const postDemand = async (demandData) => {
    try {
        const response = await axiosInstance.post('/api/local-demand', demandData); // Adjusted endpoint
        return response.data;
    } catch (error) {
        console.error('Error posting local demand:', error);
        throw error;
    }
};

export const deleteDemand = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/local-demand/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting permit data:', error);
        throw error;
    }
};


export const updateDemand = async (id, updatedDemand) => {
    try {
        const response = await axiosInstance.put(`/api/local-demand/${id}`, updatedDemand);
        return response.data;
    } catch (error) {
        console.error('Error updating demand:', error);
        throw error;
    }
};

export const updateStatusDemand = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/local-demand/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

export const updateArchiveStatus = async (id, archived) => {
    try {
        const response = await axiosInstance.put(`/api/local-demand/${id}`, { archived });
        return response.data;
    } catch (error) {
        console.error('Error updating archive status:', error);
        throw error;
    }
};

export const createPermitFromInvoice = async (invoiceId, permitData) => {
    try {
      const response = await axiosInstance.post(`/api/createPermitFromInvoice/${invoiceId}`, permitData);
      return response.data;
    } catch (error) {
        console.error('Error :', error);
      throw error;
    }
  };

  export const updatePermitStatus = async (permitId, status) => {
    try {
      const response = await axiosInstance.put(`/api/permits/status/${permitId}`, { status });
      return response;
    } catch (error) {
        console.log('Error updating permit status:', error);
      throw error;
    }
  };