/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";

const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Lecture AI API is running",
  });
});
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
