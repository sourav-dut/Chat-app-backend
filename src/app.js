import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/messages.routes.js'

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// endpoints
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

export default app;