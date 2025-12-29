import axios from "axios";

const BACKEND_URI = process.env.BACKEND_URI || "http://localhost:8000";

export const request = axios.create({
  withCredentials: true,
  baseURL: BACKEND_URI,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
