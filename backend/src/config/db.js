const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // We use 'mongo' because that is the service name in docker-compose.yml
        // Docker automatically resolves "mongo" to the correct IP address.
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/todo-app');

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;