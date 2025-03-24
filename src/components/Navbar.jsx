import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.css"; // ✅ Keep custom styling

function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 900px)"); // ✅ Responsive breakpoint

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileOpen(false); // ✅ Close mobile menu on navigation
    };

    const menuItems = user ? [
        { text: "Recipes", path: "/recipes" },
        { text: "Saved Recipes", path: "/saved-recipes" },
        { text: "Grocery List", path: "/grocery-list" },
        { text: "Logout", action: handleLogout }
    ] : [
        { text: "Recipes", path: "/recipes" },
        { text: "Login", path: "/login" },
        { text: "Signup", path: "/signup" }
    ];

    return (
        <AppBar 
            position="static" 
            sx={{ backgroundColor: "var(--primary-color)", width: "50vw", maxWidth: "800px", margin: "0 auto" }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                {/* ✅ Logo & Home Link */}
                <Link to="/" className="nav-logo">MealMatch</Link>

                {/* ✅ Desktop Navigation (Hidden on Mobile) */}
                {!isMobile && (
                    <div className="nav-links">
                        {menuItems.map((item, index) => (
                            item.action ? (
                                <Button key={index} color="inherit" onClick={item.action}>{item.text}</Button>
                            ) : (
                                <Button key={index} color="inherit" onClick={() => handleNavigation(item.path)}>{item.text}</Button>
                            )
                        ))}
                    </div>
                )}

                {/* ✅ Mobile Menu Icon (Hidden on Desktop) */}
                {isMobile && (
                    <IconButton edge="end" color="inherit" onClick={() => setMobileOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                )}
            </Toolbar>

            {/* ✅ Mobile Drawer Menu */}
            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem 
                            button 
                            key={index} 
                            onClick={item.action ? item.action : () => handleNavigation(item.path)}
                        >
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    );
}

export default Navbar;

