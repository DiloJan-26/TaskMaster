// step 19 - creating a validation schema for the registration route using zod

import {z} from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "name is required and should be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});

export {registerSchema};