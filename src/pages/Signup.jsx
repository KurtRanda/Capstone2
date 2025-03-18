import React, { useState } from "react";
import axios from "axios";

/**
 * Signup Component
 * 
 * Allows new users to create an account by providing their email and password.
 * 
 * Features:
 * - Accepts user input for email and password.
 * - Sends a signup request to the backend API.
 * - Displays an alert based on success or failure.
 */
function Signup() {
    const [email, setEmail] = useState(""); // ✅ Stores email input
    const [password, setPassword] = useState(""); // ✅ Stores password input

    /**
     * Handles the signup process by sending user credentials to the backend.
     * @param {Event} e - Form submission event.
     */
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/auth/signup", { email, password });
            alert("Signup successful! Please log in."); // ✅ Success message
        } catch (err) {
            alert("Signup failed!"); // ❌ Error message
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                {/* ✅ Email Input */}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                {/* ✅ Password Input */}
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                {/* ✅ Signup Button */}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;

