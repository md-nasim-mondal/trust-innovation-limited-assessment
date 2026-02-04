import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  NODE_ENV?: "development" | "production";
  PORT?: string | number;
  DATABASE_URL: string;
  DIRECT_URL: string;
  FRONTEND_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  return {
    NODE_ENV:
      (process.env.NODE_ENV as "development" | "production") || "development",
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL as string,
    DIRECT_URL: process.env.DIRECT_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};

export const config = loadEnvVariables();
