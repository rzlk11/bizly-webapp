import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import authRoute from "./src/routes/authRoute.js";
import categoriesRoute from "./src/routes/categoriesRoute.js";
import transactionRoute from "./src/routes/transactionRoute.js";
import userRoute from "./src/routes/userRoute.js";
import transactionProductRoute from "./src/routes/transactionProductRoute.js";
import productsRoute from "./src/routes/productsRoute.js";
import mlRoute from "./src/routes/mlRoute.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Aku-Keren-Banget",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 jam dalam milliseconds
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// routes
app.use("/auth", authRoute);
app.use("/categories", categoriesRoute);
app.use("/products", productsRoute);
app.use("/transactions", transactionRoute);
app.use("/users", userRoute);
app.use("/transactions-products", transactionProductRoute);
app.use("/ml", mlRoute);
