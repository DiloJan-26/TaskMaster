import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const warnDeprecated = (oldName, newName) => {
  if (process.env[oldName] && !process.env[newName]) {
    console.warn(
      `[config] ${oldName} is deprecated. Please rename it to ${newName}.`
    );
  }
};

warnDeprecated("MONGO_URI", "MONGODB_URI");
warnDeprecated("SEND_GRID_API", "SENDGRID_API_KEY");
warnDeprecated("FROM_EMAIL", "EMAIL_FROM");

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || process.env.SEND_GRID_API,
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.FROM_EMAIL,
  ARCJET_ENV: process.env.ARCJET_ENV,
  ARCJET_MODE: process.env.ARCJET_MODE,
  ARCJET_KEY: process.env.ARCJET_KEY,
  ARCJET_ENABLED: process.env.ARCJET_ENABLED,
};

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().int().positive(),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),
    EMAIL_PROVIDER: z.enum(["console", "sendgrid"]).default("console"),
    SENDGRID_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    ARCJET_ENV: z.string().optional(),
    ARCJET_MODE: z.string().optional(),
    ARCJET_KEY: z.string().optional(),
    ARCJET_ENABLED: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value !== "false"),
  })
  .superRefine((env, ctx) => {
    const isProduction = env.NODE_ENV === "production";
    const arcjetEnabled = env.ARCJET_ENABLED ?? true;

    if (isProduction && env.EMAIL_PROVIDER === "console") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["EMAIL_PROVIDER"],
        message: "EMAIL_PROVIDER must not be console in production",
      });
    }

    if (env.EMAIL_PROVIDER === "sendgrid") {
      if (!env.SENDGRID_API_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["SENDGRID_API_KEY"],
          message: "SENDGRID_API_KEY is required when EMAIL_PROVIDER=sendgrid",
        });
      }

      if (!env.EMAIL_FROM) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["EMAIL_FROM"],
          message: "EMAIL_FROM is required when EMAIL_PROVIDER=sendgrid",
        });
      }
    }

    if (isProduction && arcjetEnabled && !env.ARCJET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ARCJET_KEY"],
        message: "ARCJET_KEY is required in production when Arcjet is enabled",
      });
    }

    if (isProduction && env.CLIENT_URL.split(",").some((url) => url.trim() === "*")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CLIENT_URL"],
        message: "Wildcard CORS origins are not allowed in production",
      });
    }
  });

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error("[config] Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const env = parsed.data;
const clientUrls = env.CLIENT_URL.split(",")
  .map((url) => url.trim())
  .filter(Boolean);

if (env.NODE_ENV !== "production" && clientUrls.length === 0) {
  clientUrls.push("http://localhost:5173");
}

export const config = {
  nodeEnv: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  port: env.PORT,
  mongodbUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  clientUrl: clientUrls[0],
  clientUrls,
  email: {
    provider: env.EMAIL_PROVIDER,
    from: env.EMAIL_FROM || "no-reply@taskmaster.local",
    sendgridApiKey: env.SENDGRID_API_KEY,
  },
  arcjet: {
    enabled: env.ARCJET_ENABLED ?? true,
    env: env.ARCJET_ENV || env.NODE_ENV,
    mode: env.ARCJET_MODE,
    key: env.ARCJET_KEY,
  },
};

if (config.isDevelopment && !config.arcjet.key) {
  console.warn(
    "[config] ARCJET_KEY is not set. Arcjet checks will be bypassed in development."
  );
}
