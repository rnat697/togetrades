import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";

import mongoose from 'mongoose';




const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

import api from './routes/index.js';
app.use('/api/v1', api);

await mongoose.connect(process.env.DB_URL);

app.listen(port, () => console.log(`App server listening on port ${port}!`))