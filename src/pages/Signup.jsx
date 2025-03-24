import React, { useState } from "react";
import axios from "axios";
import { 
    Container, TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, useMediaQuery 
} from "@mui/material";

function Signup() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const isMobile = useMediaQuery("(max-width: 600px)"); // ✅ Adjust layout dynamically

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        // ✅ Client-side validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${backendUrl}/auth/signup`, { email, password }, { withCredentials: true });

            setSnackbarMessage("Signup successful! Please log in.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (err) {
            console.error("❌ Signup failed:", err.response ? err.response.data : err);

            if (err.response) {
                if (err.response.status === 400) {
                    setError("Email is already in use. Try another one.");
                } else {
                    setError(err.response.data.message || "An error occurred. Please try again.");
                }
            } else {
                setError("Server is unreachable. Please try again later.");
            }

            setSnackbarMessage("Signup failed.");
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
                    Sign Up
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSignup}>
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
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
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

export default Signup;



