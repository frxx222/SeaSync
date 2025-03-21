// middleware/auth.js
import jwt from 'jsonwebtoken';
import ENV from '../config.js';

// middleware/auth.js
export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No authentication token provided');
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Check for _id instead of userId
        if (!decoded._id) {
            throw new Error('User ID not found in token');
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: 'Authentication required' });
    }
};

/** auth middleware */
const Auth = async (req, res, next) => {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrieve the user details for the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" });
    }
}

/** middleware for local variables */
export const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}

/** middleware for role-based authorization */
export const AuthRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(401).json({ error: "Role not found in token" });
        }

        // For LGU roles, verify username matches municipality
        if (userRole === 'LGU') {
            const validLGUs = ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'StaCruz'];
            if (!validLGUs.includes(req.user.username)) {
                return res.status(403).json({ 
                    error: "LGU username must match municipality name" 
                });
            }
        }

        // Check if user role is in allowed roles
        if (Array.isArray(allowedRoles)) {
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    error: "You don't have permission to access this resource" 
                });
            }
        } else if (allowedRoles !== userRole) {
            return res.status(403).json({ 
                error: "You don't have permission to access this resource" 
            });
        }

        next();
    }
}

export default Auth;