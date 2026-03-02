// Step 20 - create auth-controller.js for handling authentication logic
// here we done the registration logic and later we will add login logic and other
// Step 21 - go to frontend - install tanstack query go to web - 1:37:00 [https://tanstack.com/query/latest/docs/framework/react/installation] make sure to select react + latest at top right
// install it in frontend - npm i @tanstack/react-query Step 21 - [client -> app -> provider]

import User from "../models/User.js";
import bcrypt from "bcrypt";

// create registerUser functions for handling registration logic
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; 

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create a new user in the database
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        //TO DO: send email

        // Return success response
        res.status(201).json({ message: "verification email sent check your inbox"});
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const loginUser = async (req, res) => {};

export { registerUser, loginUser };