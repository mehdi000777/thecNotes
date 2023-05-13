import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import root from './routes/root.js';
import { fileURLToPath } from 'url';
import { logEvent, logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConnect.js';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// DB Connect
connectDB();

// Midelwares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', root);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('text').send('404 Not Found')
    }
})

// Error Handler
app.use(errorHandler);

// App Listen
const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`app run on http://localhost:${PORT}`);
    });
})

mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})
