const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./config/db")
const authRoutes = require('./routes/authRoutes');
const sendEmail = require('./utils/sendEmail');
dotenv.config();
connectDB()
const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.get("/", (req, res) => {
    res.send("ShopNest Backend is working!");
});

app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

