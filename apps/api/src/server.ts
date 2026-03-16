import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../../.env") })

import authRoutes from "./routes/auth.route"
import postRoutes from "./routes/post.route"
import { votePost } from "./controllers/vote.controller"

const app = express()

// to keep the server awake
app.get("/", (req, res) => {
  res.status(200).send("Backend is Up and Running!");
});
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/vote", votePost)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})