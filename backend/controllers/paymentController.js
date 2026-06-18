const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const getRazorpayConfig = () => {
  const keyId = (
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_API_ID ||
    process.env.RAZORPAY_ID ||
    ''
  ).trim();
  const keySecret = (
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_API_SECRET ||
    process.env.RAZORPAY_SECRET_KEY ||
    process.env.RAZORPAY_SECRET ||
    ''
  ).trim();

  return { keyId, keySecret };
};

const getRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayConfig();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Render.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const getErrorMessage = (error) => {
  return error?.error?.description || error?.error?.reason || error.message || 'Payment server error';
};

const createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    const instance = getRazorpayInstance();
    const { keyId } = getRazorpayConfig();
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return res.status(error.statusCode || 500).json({ message: getErrorMessage(error) });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification data is missing' });
    }

    const { keySecret } = getRazorpayConfig();

    if (!keySecret) {
      return res.status(500).json({ message: 'Razorpay secret is not configured' });
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', keySecret)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    return res.status(200).json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('Razorpay payment verification failed:', error);
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

module.exports = { createOrder, verifyPayment };
