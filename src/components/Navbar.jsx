import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.css"; // ✅ Import custom styling for the navbar

/**
 * Navbar component for navigation across the application.
 * Displays different links based on user authentication status.
 * 
 * @param {Object} props - Component props
 * @param {Object|null} props.user - User object if logged in, otherwise null.
 * @param {Function} props.setUser - Function to update the user state after logout.
 */
function Navbar({ user, setUser }) {
    const navigate = useNavigate(); // ✅ Hook for programmatic navigation
    const [mobileOpen, setMobileOpen] = useState(false); // ✅ State to manage mobile menu visibility

    /**
     * Handles user logout by removing the authentication token and redirecting to login.
     */
    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ Remove stored authentication token
        setUser(null); // ✅ Reset user state
        navigate("/login"); // ✅ Redirect to login page
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "var(--primary-color)" , width: "50vw", maxWidth: "800px", margin: "0 auto" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                {/* ✅ Logo & Home Link */}
                <Link to="/" className="nav-logo">MealMatch</Link>

                {/* ✅ Desktop Navigation Links (Visible when user is logged in) */}
                <div className="nav-links">
                    <Link to="/recipes">Recipes</Link>
                    {user && <Link to="/saved-recipes">Saved Recipes</Link>}
                    {user && <Link to="/grocery-list">Grocery List</Link>}
                </div>

                {/* ✅ Authentication Buttons (Login/Signup or Logout) */}
                <div className="nav-actions">
                    {user ? (
                        <Button 
                            onClick={handleLogout} 
                            variant="contained" 
                            sx={{ backgroundColor: "var(--accent-color)", "&:hover": { backgroundColor: "#e07b39" } }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button component={Link} to="/login" sx={{ color: "white" }}>
                                Login
                            </Button>
                            <Button component={Link} to="/signup" variant="contained" sx={{ backgroundColor: "var(--accent-color)", "&:hover": { backgroundColor: "#e07b39" } }}>
                                Signup
                            </Button>
                        </>
                    )}
                </div>

                {/* ✅ Mobile Menu Icon (Only visible on smaller screens) */}
                <IconButton 
                    edge="start" 
                    color="inherit" 
                    aria-label="menu" 
                    sx={{ display: { md: "none" } }} 
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <MenuIcon />
                </IconButton>

            </Toolbar>

            {/* ✅ Collapsible Mobile Menu (Only appears when mobileOpen is true) */}
            {mobileOpen && (
                <div className="mobile-nav">
                    <Link to="/recipes" onClick={() => setMobileOpen(false)}>Recipes</Link>
                    {user && <Link to="/saved-recipes" onClick={() => setMobileOpen(false)}>Saved Recipes</Link>}
                    {user && <Link to="/grocery-list" onClick={() => setMobileOpen(false)}>Grocery List</Link>}
                    {!user && <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>}
                    {!user && <Link to="/signup" onClick={() => setMobileOpen(false)}>Signup</Link>}
                    {user && (
                        <Button 
                            onClick={handleLogout} 
                            variant="contained" 
                            sx={{ backgroundColor: "var(--accent-color)", "&:hover": { backgroundColor: "#e07b39" } }}
                        >
                            Logout
                        </Button>
                    )}
                </div>
            )}
        </AppBar>
    );
}

export default Navbar;

