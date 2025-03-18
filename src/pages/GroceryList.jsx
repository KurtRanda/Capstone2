import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, Typography, Container, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function GroceryList({ user }) {
    const [groceryItems, setGroceryItems] = useState([]);

    useEffect(() => {
        if (user) {
            fetchGroceryList();
        }
    }, [user]);

    const fetchGroceryList = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/grocery-list/`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setGroceryItems(res.data);
        } catch (err) {
            console.error("Error fetching grocery list:", err.response ? err.response.data : err);
        }
    };

    const togglePurchased = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `http://localhost:5000/grocery-list/${itemId}/toggle`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setGroceryItems(groceryItems.map(item =>
                item.id === itemId ? { ...item, purchased: !item.purchased } : item
            ));
        } catch (err) {
            console.error("Error updating item:", err.response ? err.response.data : err);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/grocery-list/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setGroceryItems(groceryItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error("Error removing item:", err.response ? err.response.data : err);
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
                    backgroundColor: "rgba(255, 255, 255, 0.85)", // ✅ Soft white background with transparency
                    borderRadius: "12px", // ✅ Rounded corners for a card-like effect
                    backdropFilter: "blur(8px)", // ✅ Slight blur effect for better readability
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: "20px", color: "#2c3639", fontWeight: "bold" }}>
                    Your Grocery List 🛒
                </Typography>

                {groceryItems.length === 0 ? (
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



