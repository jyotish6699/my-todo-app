const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const connectDB = require('./src/config/db');
require('dotenv').config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/todos', require('./src/routes/todoRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// Simple error handler if not created yet
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});