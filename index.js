import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import FormData from "form-data";
import multer from "multer";
import cors from "cors";
import computeStringSimilarity from "./levenshtein.js";
const upload = multer();

const app = express();
app.use(cors());
const port = process.env.PORT;
const transcriptionUrl = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_API_KEY = process.env.API_KEY;

//post request to transcribe audio
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", req.file.buffer, { filename: req.file.originalname });

  try {
    const response = await fetch(transcriptionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const resTxt = await response.json();
    res.json(
      computeStringSimilarity(
        "This is my family. I live in a city.",
        resTxt.text
      )
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to transcribe audio file." });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
