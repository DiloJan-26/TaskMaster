// step 12 - setting up the server and connecting to the database

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

// related to Step 17 - after creating auth routes we need to import them here and use them
import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to TaskMaster API" });
});

// Step 17.1 - after import use them here [http://localhost:5000/api-v1/auth/register]
app.use("/api-v1", routes);

//error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error!" });
});

// not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
