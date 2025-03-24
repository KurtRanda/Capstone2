import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, List, ListItem, ListItemText, Button, CircularProgress } from "@mui/material";
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../api/api";

function GroceryList({ user }) {
    const [groceryItems, setGroceryItems] = useState([]); 
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        if (user) {
            fetchGroceryList();
        }
    }, [user]);

    const fetchGroceryList = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/grocery-list/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems(res.data.groceryList); // Assuming the API returns an object with 'groceryList'
        } catch (err) {
            console.error("❌ Error fetching grocery list:", err.response ? err.response.data : err);
        } finally {
            setLoading(false); // Stop loading once data is fetched
        }
    };

    const togglePurchased = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            await api.patch(`/grocery-list/${itemId}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems((prevItems) =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, purchased: !item.purchased } : item
                )
            );
        } catch (err) {
            console.error("❌ Error updating item:", err.response ? err.response.data : err);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/grocery-list/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems((prevItems) => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error("❌ Error removing item:", err.response ? err.response.data : err);
        }
    };

    return (
        <Container sx={{ width: "100%", maxWidth: "100vw", textAlign: "center", paddingTop: "20px" }}>
            <Paper
                elevation={4}
                sx={{
                    maxWidth: "600px",
                    margin: "auto",
                    padding: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    borderRadius: "12px",
                    backdropFilter: "blur(8px)",
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: "20px", color: "#2c3639", fontWeight: "bold" }}>
                    Your Grocery List 🛒
                </Typography>

                {/* Loading indicator styled to match other loading indicators */}
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <CircularProgress />
                        <p>Loading your grocery list...</p>
                    </div>
                ) : groceryItems.length === 0 ? (
                    <Typography variant="body1" sx={{ color: "gray" }}>
                        Your list is empty!
                    </Typography>
                ) : (
                    <List>
                        {groceryItems.map(item => (
                            <ListItem
                                key={item.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    borderBottom: "1px solid #ddd",
                                    padding: "10px 0",
                                }}
                            >
                                <ListItemText
                                    primary={item.ingredient_name}
                                    secondary={`${item.quantity || ""} ${item.unit || ""}`}
                                    sx={{ textDecoration: item.purchased ? "line-through" : "none" }}
                                />

                                <Button
                                    onClick={() => togglePurchased(item.id)}
                                    startIcon={item.purchased ? <CancelIcon /> : <CheckCircleIcon />}
                                    color={item.purchased ? "warning" : "success"}
                                >
                                    {item.purchased ? "Undo" : "Mark Purchased"}
                                </Button>

                                <Button
                                    onClick={() => handleRemoveItem(item.id)}
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
}

export default GroceryList;


