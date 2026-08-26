import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRouter from "./routes/auth.js";
import sessionRouter from "./routes/sessions.js";
import taskRouter from "./routes/tasks.js";
import profileRouter from "./routes/user.js";

dotenv.config();

const dbUri = process.env.MONGODB_URI;
mongoose.connect(dbUri).then(() => {
    console.log("MongoDB Connected!");
})
    .catch((err) => {
        console.log(err);
    })

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/sessions", sessionRouter);
app.use("/tasks", taskRouter)
app.use("/user", profileRouter)

app.listen(3000, () => {
    console.log("Server started on port 3000!");
})
