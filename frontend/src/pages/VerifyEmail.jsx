import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Email verified successfully. Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error(error);
      alert('Could not verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      alert('Please enter your email first.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'A new OTP has been sent.');
      } else {
        alert(data.message || 'Could not resend OTP');
      }
    } catch (error) {
      console.error(error);
      alert('Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength="6"
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" className="btn" disabled={loading} onClick={handleResendOtp}>
          Resend OTP
        </button>
        <p>Already verified? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default VerifyEmail;
