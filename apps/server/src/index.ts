import express, { Express } from "express";
import { PORT } from "./config";

const app = express();

app.get("/", (req, res) => {
  res.send("hello boi whats up haha!");
});

app.listen(PORT, () => {
  console.log("server running at http://localhost:8000");
});
