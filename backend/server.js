require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Fix CORS Policy Issue
app.use(cors({
  origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  },
  credentials: true
}));


// Import Routes
const usersRoutes = require("./routes/users");
const recipesRoutes = require("./routes/recipes");
const ingredientsRoutes = require("./routes/ingredients");
const authRoutes = require("./routes/auth");
const groceryListRoutes = require("./routes/groceryList");

// Use Routes
app.use("/users", usersRoutes);
app.use("/recipes", recipesRoutes);
app.use("/ingredients", ingredientsRoutes);
app.use("/auth", authRoutes);
app.use("/grocery-list", groceryListRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Root Route
app.get("/", (req, res) => {
    res.send("MealMatch Backend is Running!");
});
