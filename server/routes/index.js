// Step 15 - create index.js file for routes
import express from "express";
import authRoutes from "./auth.js";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
