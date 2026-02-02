import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  NODE_ENV: "development" | "production";
  PORT: string;
  DATABASE_URL: string;
  CLIENT_URL: string;
  bcrypt: {
    SALT_ROUND: string;
  };
  jwt: {
    JWT_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    RESET_PASS_SECRET: string;
    RESET_PASS_TOKEN_EXPIRES_IN: string;
  };
  cloudinary: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  emailSender: {
    EMAIL: string;
    APP_PASS: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "NODE_ENV",
    "PORT",
    "CLIENT_URL",
    "DATABASE_URL",
    "SALT_ROUND",
    "JWT_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRES_IN",
    "RESET_PASS_SECRET",
    "RESET_PASS_TOKEN_EXPIRES_IN",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_EMAIL",
    "SMTP_APP_PASS",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    PORT: process.env.PORT as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    bcrypt: {
      SALT_ROUND: process.env.SALT_ROUND as string,
    },
    jwt: {
      JWT_SECRET: process.env.JWT_SECRET as string,
      ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
      REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
      RESET_PASS_SECRET: process.env.RESET_PASS_SECRET as string,
      RESET_PASS_TOKEN_EXPIRES_IN: process.env.RESET_PASS_TOKEN_EXPIRES_IN as string,
      },
    cloudinary: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    emailSender: {
      EMAIL: process.env.SMTP_EMAIL as string,
      APP_PASS: process.env.SMTP_APP_PASS as string,
    },
  };
};

export const config = loadEnvVariables();
