import dotenv from "dotenv";

dotenv.config();

export const {
  EMAIL_SERVICE,
  PASS_EMAIL,
  PORT,
  MONGODB_URI,
  SESSION_KEY,
  JWT_KEY,
  JWT_REFRESH_KEY,
  SERVER_DOMAIN,
  CLIENT_DOMAIN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;
