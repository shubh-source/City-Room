import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { User, CheckCircle, ArrowLeft } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { AppContext } from '../../context/AppContext';

const Login = () => {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'renter';

  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-login', {
        size: 'invisible',
      });
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (identifier.length < 10) return;
    setLoading(true);

    try {
      // 1. Send OTP via Firebase
      const phoneNumber = identifier.includes('+') ? identifier : '+91' + identifier;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert(`Firebase Error: ${err.message}`);
      if (window.recaptchaVerifier) window.recaptchaVerifier.render().then(widgetId => window.grecaptcha.reset(widgetId));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);

    try {
      // 2. Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      // 3. Send token to backend to login
      const data = await api.post('/auth/login', { idToken });
      
      localStorage.setItem('homedo_token', data.token);
      localStorage.setItem('homedo_user', JSON.stringify(data.user));
      setUser(data.user);
      
      if (data.user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/renter');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Invalid OTP or user not found');
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
          {otpSent ? 'Enter the 6-digit code sent to your phone' : 'Enter your 10-digit phone number to continue'}
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="10-digit number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  autoFocus
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-4" 
              style={{ width: '100%', padding: '0.875rem' }}
              disabled={identifier.length < 10 || loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
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
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
                autoFocus
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-4" 
              style={{ width: '100%', padding: '0.875rem' }}
              disabled={otp.length < 6 || loading}
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
                Change Phone Number
              </button>
            </div>
          </form>
        )}
        <div id="recaptcha-container-login"></div>
      </div>
    </div>
  );
};

export default Login;
