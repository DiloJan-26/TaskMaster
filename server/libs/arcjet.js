// Step 24 - create arcjet.js for handling all authentication related logic in one place and then we will use it in auth-controller.js to keep our code clean and organized

import arcjet, {
  detectBot,
  shield,
  tokenBucket,
  validateEmail,
} from "@arcjet/node";

const resolveArcjetMode = () => {
  if (process.env.ARCJET_MODE) {
    return process.env.ARCJET_MODE.toUpperCase();
  }

  const runtimeEnv =
    process.env.NODE_ENV?.toLowerCase() ||
    process.env.ARCJET_ENV?.toLowerCase() ||
    "development";

  return runtimeEnv === "production" ? "LIVE" : "DRY_RUN";
};

const mode = resolveArcjetMode();

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode }),
    // Create a bot detection rule
    detectBot({
      mode, // Blocks requests in LIVE mode. Logs only in DRY_RUN mode
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    validateEmail({
      mode, // Blocks invalid emails in LIVE mode, logs only in DRY_RUN mode
      // block disposable, invalid, and email addresses with no MX records
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode,
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;
