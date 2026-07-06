import sgMail from "@sendgrid/mail";
import { config } from "../config/env.js";

const extractLinks = (html) => {
  const matches = html.match(/https?:\/\/[^\s"'<>]+/g);
  return matches || [];
};

if (config.email.provider === "sendgrid") {
  sgMail.setApiKey(config.email.sendgridApiKey);
}

export const sendEmail = async (to, subject, html) => {
  if (config.email.provider === "console") {
    const links = extractLinks(html);

    console.log("[email:console] Email delivery skipped in development.");
    console.log(`[email:console] To: ${to}`);
    console.log(`[email:console] Subject: ${subject}`);

    if (links.length > 0) {
      console.log("[email:console] Links:");
      for (const link of links) {
        console.log(`[email:console] - ${link}`);
      }
    }

    return true;
  }

  const msg = {
    to,
    from: `TaskHub <${config.email.from}>`,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");

    return true;
  } catch (error) {
    console.error("Error sending email:", error);

    return false;
  }
};
