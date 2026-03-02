// Step 16 - create auth.js file for authentication routes
// Step 18 - editting happening

import express from "express";
import {z} from "zod";
import { validateRequest } from "zod-express-middleware";
import { registerSchema } from "../libs/validate-schema.js";
import { registerUser } from "../controllers/auth-controller.js";

const router = express.Router();


router.post(
  "/register",
  validateRequest({
    body: registerSchema   // related to step 19
  }),
  registerUser

);

// router.post(
//   "/login",
//   validateRequest({
//     body: loginSchema   // related to step 19
//   }),
//   loginUser

// );

export default router;
