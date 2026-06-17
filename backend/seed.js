const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const User = require('./model/User');
const Product = require('./model/Product');
const Order = require('./model/Order');

dotenv.config({ path: path.join(__dirname, '.env') });

const products = [
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Soft everyday cotton t-shirt with a comfortable regular fit.',
    price: 799,
    category: 'Clothing',
    imageURL: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    rating: 4.5,
    numReviews: 28,
    stock: 45,
  },
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with clear sound and long battery life.',
    price: 3499,
    category: 'Electronics',
    imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: 4.7,
    numReviews: 64,
    stock: 20,
  },
  {
    name: 'Leather Backpack',
    description: 'Spacious brown backpack suitable for work, college, and travel.',
    price: 2299,
    category: 'Accessories',
    imageURL: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    rating: 4.3,
    numReviews: 19,
    stock: 16,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned soles and breathable fabric.',
    price: 2999,
    category: 'Footwear',
    imageURL: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    rating: 4.6,
    numReviews: 41,
    stock: 30,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness-focused smart watch with heart-rate and activity tracking.',
    price: 4999,
    category: 'Electronics',
    imageURL: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    rating: 4.4,
    numReviews: 36,
    stock: 12,
  },
  {
    name: 'Ceramic Coffee Mug',
    description: 'Minimal ceramic mug for coffee, tea, and other hot drinks.',
    price: 449,
    category: 'Home',
    imageURL: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d',
    rating: 4.2,
    numReviews: 14,
    stock: 60,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const password = await bcrypt.hash('password123', 10);
    const seedUsers = await Promise.all([
      User.findOneAndUpdate(
        { email: 'admin@shopnest.com' },
        {
          name: 'ShopNest Admin',
          email: 'admin@shopnest.com',
          password,
          role: 'admin',
          verified: true,
        },
        { upsert: true, returnDocument: 'after', runValidators: true }
      ),
      User.findOneAndUpdate(
        { email: 'demo@shopnest.com' },
        {
          name: 'Demo Customer',
          email: 'demo@shopnest.com',
          password,
          role: 'user',
          verified: true,
        },
        { upsert: true, returnDocument: 'after', runValidators: true }
      ),
    ]);

    const seedProducts = await Promise.all(
      products.map((product) =>
        Product.findOneAndUpdate({ name: product.name }, product, {
          upsert: true,
          returnDocument: 'after',
          runValidators: true,
        })
      )
    );

    await Order.deleteMany({ paymentId: /^seed-/ });

    const demoUser = seedUsers[1];
    const orderItems = [
      { productId: seedProducts[1]._id, qty: 1, price: seedProducts[1].price },
      { productId: seedProducts[5]._id, qty: 2, price: seedProducts[5].price },
    ];

    await Order.create({
      userId: demoUser._id,
      items: orderItems,
      totalAmount: orderItems.reduce((total, item) => total + item.price * item.qty, 0),
      address: {
        fullName: demoUser.name,
        street: '12 MG Road',
        city: 'Indore',
        postalCode: '452001',
        country: 'India',
      },
      paymentId: 'seed-demo-order-001',
      status: 'Delivered',
    });

    console.log(`Seed complete: ${seedUsers.length} users, ${seedProducts.length} products, and 1 order.`);
    console.log('Demo logins: admin@shopnest.com / password123 and demo@shopnest.com / password123');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
