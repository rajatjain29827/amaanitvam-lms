import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../server/config/db.js';
import app from '../server/app.js';

connectDB();

export default app;
