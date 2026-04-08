import express from "express";
import dotenv from "dotenv";
import runAggregator from "./cron.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Job Aggregator Running 🚀");
});

// manual trigger (IMPORTANT for testing)
app.get("/run", async (req, res) => {
  await runAggregator();
  res.send("Job fetch completed");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});