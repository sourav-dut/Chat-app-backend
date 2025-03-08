import { connectDB } from '../config/db.js';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

connectDB();
const PORT = process.env.PORT || 4600;

app.listen(PORT, () => console.log(`server started- http://localhost:${PORT}`));