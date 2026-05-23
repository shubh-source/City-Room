import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { User, CheckCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'renter';

  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (identifier.length < 5) return;
    setLoading(true);
    try {
      await api.post('/auth/login', { identifier });
      setOtpSent(true);
    } catch (err) {
      alert(err.message || 'User not found. Please sign up first.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    try {
      const data = await api.post('/auth/verify-login', { identifier, otp });
      localStorage.setItem('cityroom_token', data.token);
      localStorage.setItem('cityroom_user', JSON.stringify(data.user));
      
      if (data.user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/renter');
      }
    } catch (err) {
      alert('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center p-8 animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      
      <div className="card w-full max-w-md" style={{ maxWidth: '400px', width: '100%' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h2 className="font-bold mb-2" style={{ fontSize: '1.5rem' }}>
          {role === 'owner' ? 'Owner Login' : 'Renter Login'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {otpSent ? 'Enter the 4-digit code sent to your phone/email' : 'Enter your email or phone number to continue'}
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label className="input-label">Email or Phone Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="you@example.com or 10-digit number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-4" 
              style={{ width: '100%', padding: '0.875rem' }}
              disabled={identifier.length < 5 || loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <div className="text-center mt-4">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Don't have an account? <Link to={`/signup?role=${role}`} style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign Up</Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="animate-fade-in">
             <div className="input-group">
              <label className="input-label">One Time Password</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
                autoFocus
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-4" 
              style={{ width: '100%', padding: '0.875rem' }}
              disabled={otp.length < 4 || loading}
            >
              <CheckCircle size={20} />
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => { setOtpSent(false); setOtp(''); }}
                style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: '500' }}
              >
                Change Email/Phone
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
