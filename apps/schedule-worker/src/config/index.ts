import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL!;
export const RABBITMQ_URL = process.env.RABBITMQ_URL!;
export const MAIL_USER = process.env.MAIL_USER!;
export const MAIL_PASS = process.env.MAIL_PASS!;
