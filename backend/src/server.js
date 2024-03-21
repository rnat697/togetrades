import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongoose from "mongoose";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions));

import api from './routes/index.js';
app.use('/api/v1', api);

await mongoose.connect(process.env.DB_URL);

app.listen(port, () => console.log(`App server listening on port ${port}!`))