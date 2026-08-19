import emailRoutes from "./routes/emailRoutes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/emails", emailRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "ReachInbox Email Scheduler API is running 🚀",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});