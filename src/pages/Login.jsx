import React, { useState } from "react";
import api from "../api/api"; // ✅ Use centralized API instance
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // ✅ Redirect after login

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            console.log("🔄 Sending login request to backend...");
            const res = await api.post(  // ✅ Use `api.post` instead of `axios.post`
                "/auth/login",  // ✅ No need for full URL since `api` is configured
                { email, password }
            );

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);  // Store token
                console.log("🟢 Token stored:", res.data.token);
            } else {
                console.error("❌ No token received from backend!");
            }
            
            console.log("✅ Login successful:", res.data);
            setUser(res.data.user);  
            alert("Login successful!");
            navigate("/");  // ✅ Redirect user after login

        } catch (err) {
            console.error("❌ Login failed:", err.response ? err.response.data : err);
            setError("Invalid email or password.");
        }
    };
    
    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleLogin}>
                    <TextField 
                        label="Email" 
                        variant="outlined" 
                        fullWidth 
                        margin="normal"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <TextField 
                        label="Password" 
                        type="password"
                        variant="outlined" 
                        fullWidth 
                        margin="normal"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;

