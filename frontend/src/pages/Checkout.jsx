import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const readResponseBody = async (res) => {
    const text = await res.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      return { message: text };
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const saveOrder = async (paymentId) => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount: totalPrice,
        address,
        paymentId
      })
    });

    const data = await saveOrderRes.json().catch(() => ({}));

    if (!saveOrderRes.ok) {
      throw new Error(data.message || 'Order saving failed');
    }

    dispatch(clearCart());
    navigate('/ordersuccess');
  };

  const handlePayment = async () => {
    try {
      if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
      }

      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert('Razorpay checkout could not load. Please check your connection.');
        setLoading(false);
        return;
      }

      const orderRes = await fetch('/api/payments/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await readResponseBody(orderRes);

      if (!orderRes.ok) {
        alert(orderData.message || `Payment failed to initialize (${orderRes.status})`);
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'ShopNest order payment',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify(response)
            });
            const verifyData = await readResponseBody(verifyRes);

            if (!verifyRes.ok) {
              alert(verifyData.message || 'Payment verification failed');
              return;
            }

            await saveOrder(verifyData.paymentId || response.razorpay_payment_id);
          } catch (error) {
            console.error(error);
            alert(error.message || 'Order saving failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || ''
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        alert(response.error?.description || 'Payment failed');
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
          <div className="checkout-summary">
            <h4>Total to Pay: Rs. {totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
