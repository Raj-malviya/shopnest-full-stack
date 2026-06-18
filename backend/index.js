const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require("./config/db")
const authRoutes = require('./routes/authRoutes');
dotenv.config();
connectDB()
const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.RENDER_EXTERNAL_URL,
    ...(process.env.FRONTEND_URL || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
];

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/", (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        return next();
    }

    return res.send("ShopNest Backend is working!");
});
// app.get('/test-email', async (req, res) => {
//     try {
//         await sendEmail(
//             'tilak.malviya.2002@gmail.com',
//             'Test Email',
//             'Hello from ShopNest'
//         );

//         res.send('Email sent successfully');
//     } catch (error) {
//         console.log(error);
//         res.send('Email failed');
//     }
// });

app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

if (process.env.NODE_ENV === "production") {
    const frontendBuildPath = path.join(__dirname, "../frontend/build");

    app.use(express.static(frontendBuildPath));
    app.use((req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

