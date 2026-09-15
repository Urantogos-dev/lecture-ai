/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import { db } from "./db";
import { sql } from "drizzle-orm";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Lecture AI API is running",
  });
});
app.get("/api/lectures/:id/transcript", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(sql`
      SELECT id, lecture_id, raw_content, clean_content, language
      FROM transcripts
      WHERE lecture_id = ${id}
      ORDER BY id DESC
      LIMIT 1;
    `);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Transcript not found",
      });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    console.error("GET TRANSCRIPT ERROR:", error);

    res.status(500).json({
      message: "Failed to get transcript",
    });
  }
});
app.post(
  "/api/lectures/:id/transcribe",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Audio file is required",
        });
      }

      const { id } = req.params;

      const formData = new FormData();

      formData.append("file", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
      });

      const response = await axios.post(
        "http://localhost:8000/transcribe",
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      const transcriptText = response.data.text;

      await db.execute(sql`
        INSERT INTO transcripts (
          lecture_id,
          raw_content,
          language
        )
        VALUES (
          ${id},
          ${transcriptText},
          'mn'
        );
      `);

      fs.unlinkSync(req.file.path);

      res.json({
        message: "Transcription completed",
        data: {
          text: transcriptText,
        },
      });
    } catch (error) {
      console.error("TRANSCRIBE ERROR:", error);

      res.status(500).json({
        message: "Failed to transcribe audio",
      });
    }
  },
);
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
app.get("/api/lectures", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT *
      FROM lectures
      ORDER BY id ASC;
    `);

    res.json({
      data: result,
    });
  } catch (error) {
    console.error("GET LECTURES ERROR:", error);

    res.status(500).json({
      message: "Failed to get lectures",
    });
  }
});
app.get("/api/lectures/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(sql`
      SELECT *
      FROM lectures
      WHERE id = ${id};
    `);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    console.error("GET LECTURE ERROR:", error);

    res.status(500).json({
      message: "Failed to get lecture",
    });
  }
});

app.delete("/api/lectures/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(sql`
      DELETE FROM lectures
      WHERE id = ${id}
      RETURNING id;
    `);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    res.json({
      message: "Lecture deleted",
      data: result[0],
    });
  } catch (error) {
    console.error("DELETE LECTURE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete lecture",
    });
  }
});
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
