const mongoose = require('mongoose');
const dns = require('dns');

// MongoDB Atlas mongodb+srv connections require SRV DNS lookups.
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    
    }
};

module.exports = connectDB;
