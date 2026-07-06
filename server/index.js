// step 12 - setting up the server and connecting to the database

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

// related to Step 17 - after creating auth routes we need to import them here and use them
import routes from "./routes/index.js";
import { config } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (config.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to TaskMaster API" });
});

// Step 17.1 - after import use them here [http://localhost:5000/api-v1/auth/register]
app.use("/api-v1", routes);

//error middleware
app.use((err, req, res, next) => {
  console.error("Error details:", err); // Log full error object
  
  // Handle Zod validation errors from zod-express-middleware
  if (err.name === 'ZodError' || err.issues) {
    return res.status(400).json({ 
      message: "Validation error",
      errors: err.issues || err.errors 
    });
  }
  
  // Handle other errors
  res.status(err.status || 500).json({ 
    message: err.message || "Internal server error!" 
  });
});

// not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
