/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import { db } from "./db";
import { sql } from "drizzle-orm";

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
  try {
    const { userId, title, description } = req.body;

    const result = await db.execute(sql`
      INSERT INTO lectures (user_id, title, description)
      VALUES (${userId}, ${title}, ${description})
      RETURNING id, user_id, title, description;
    `);

    res.status(201).json({
      message: "Lecture created",
      data: result[0],
    });
  } catch (error) {
    console.error("CREATE LECTURE ERROR:", error);

    res.status(500).json({
      message: "Failed to create lecture",
    });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
