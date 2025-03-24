import React, { useState } from "react";
import api from "../api/api"; 
import { useNavigate } from "react-router-dom";
import { 
    Container, TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, useMediaQuery 
} from "@mui/material";

function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const navigate = useNavigate();  

    const isMobile = useMediaQuery("(max-width: 600px)"); // ✅ Adjust layout dynamically

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        // ✅ Client-side validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            console.log("🔄 Sending login request to backend...");
            const res = await api.post("/auth/login", { email, password });

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);  
                console.log("🟢 Token stored");
                setUser(res.data.user);
                setSnackbarMessage("Login successful!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                navigate("/");
            } else {
                throw new Error("No token received from backend.");
            }
        } catch (err) {
            console.error("❌ Login failed:", err.response ? err.response.data : err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError("Invalid email or password.");
                } else {
                    setError(err.response.data.message || "An error occurred. Please try again.");
                }
            } else {
                setError("Server is unreachable. Please try again later.");
            }

            setSnackbarMessage("Login failed.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: isMobile ? 3 : 5, textAlign: "center", padding: isMobile ? "10px" : "20px" }}>
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

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2 }}
                        disabled={loading} 
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
                    </Button>
                </form>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Login;


