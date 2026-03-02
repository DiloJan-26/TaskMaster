// Step 16 - create auth.js file for authentication routes
// Step 18 - editting happening

import express from "express";
import {z} from "zod";
import { validateRequest } from "zod-express-middleware";
import { registerSchema } from "../libs/validate-schema";

const router = express.Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema
  }),

);
