import UserApp from '../models/UserApp.model.js'; // Import your UserApp model
import bcrypt from 'bcrypt'; // For hashing passwords
import jwt from 'jsonwebtoken'; // For generating JSON Web Tokens


// Register a new user
export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if user with the same username already exists
        const existingUser = await UserApp.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserApp({
            username,
            password: hashedPassword,
            role,
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await UserApp.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate a JWT (JSON Web Token) for the authenticated user
        const token = jwt.sign({ userId: user._id, role: user.role }, ENV.JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};