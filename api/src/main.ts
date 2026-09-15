/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import { db } from "./db";

const app = express();
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Lecture AI API is running",
  });
});

app.post("/api/lectures", async (req, res) => {
  console.log(req.body);

  res.json({
    message: "Lecture received",
    data: req.body,
  });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
