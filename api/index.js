import dotenv from "dotenv";
dotenv.config();
import sequelize from "./src/config/database.js"
import express from "express";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import authRoute from "./src/routes/authRoute.js";
import categoriesRoute from "./src/routes/categoriesRoute.js";
import transactionRoute from "./src/routes/transactionRoute.js";
import userRoute from "./src/routes/userRoute.js";
import transactionProductRoute from "./src/routes/transactionProductRoute.js";
import productsRoute from "./src/routes/productsRoute.js";
import mlRoute from "./src/routes/mlRoute.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "https://strong-begonia-b04a4a.netlify.app" }));

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: sequelize,
});

store.sync();

app.use(
  session({
    store: store,
    secret: process.env.SESSION_SECRET || "Aku-Keren-Banget",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 jam dalam milliseconds
    },
  })
);

// (async () => {
//   await sequelize.sync({ alter: true });
// })();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// routes
app.use("/auth", authRoute);
app.use("/categories", categoriesRoute);
app.use("/products", productsRoute);
app.use("/transactions", transactionRoute);
app.use("/users", userRoute);
app.use("/transactions-products", transactionProductRoute);
app.use("/ml", mlRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
