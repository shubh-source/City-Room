import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { User, CheckCircle, ArrowLeft } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithCustomToken } from 'firebase/auth';
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
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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
    if (!identifier) return;
    
    const isEmail = identifier.includes('@');
    if (!isEmail && identifier.replace(/\D/g, '').length < 10) return alert('Enter a valid email or 10-digit phone number');
    
    setLoading(true);

    try {
      if (isEmail) {
        // Send OTP to email only
        await api.post('/auth/send-email-otp', { identifier: identifier.trim(), isSignup: false });
        setOtpSent(true);
        setResendTimer(30);
      } else {
        // Send OTP via Firebase (Phone)
        const phoneOnly = identifier.replace(/\D/g, '');
        const phoneNumber = identifier.includes('+') ? identifier : '+91' + phoneOnly;
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        
        // Parallel: Send fallback OTP to their registered email via backend
        api.post('/auth/send-email-otp', { identifier: identifier.trim(), isSignup: false })
           .catch(err => console.log('Email fallback skipped or failed', err));
           
        setOtpSent(true);
        setResendTimer(30);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || `Error: ${err.message}`);
      if (window.recaptchaVerifier) window.recaptchaVerifier.render().then(widgetId => window.grecaptcha.reset(widgetId));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);

    const isEmail = identifier.includes('@');

    try {
      let finalToken, finalUser;

      if (isEmail) {
        // Verify Email OTP via Backend
        const emailVerifyData = await api.post('/auth/verify-email-otp', {
          identifier: identifier.trim(), code: otp.trim(), isSignup: false
        });
        await signInWithCustomToken(auth, emailVerifyData.customToken);
        finalToken = emailVerifyData.token;
        finalUser = emailVerifyData.user;
      } else {
        // Verify Phone OTP via Firebase
        try {
          const result = await confirmationResult.confirm(otp);
          const idToken = await result.user.getIdToken();
          const data = await api.post('/auth/login', { idToken });
          finalToken = data.token;
          finalUser = data.user;
        } catch (fbErr) {
          // If Firebase SMS OTP fails, fallback to backend Email OTP
          const emailVerifyData = await api.post('/auth/verify-email-otp', {
            identifier: identifier.trim(), code: otp.trim(), isSignup: false
          });
          await signInWithCustomToken(auth, emailVerifyData.customToken);
          finalToken = emailVerifyData.token;
          finalUser = emailVerifyData.user;
        }
      }
      
      localStorage.setItem('homedo_token', finalToken);
      localStorage.setItem('homedo_user', JSON.stringify(finalUser));
      setUser(finalUser);
      
      if (finalUser.role === 'owner') navigate('/owner');
      else navigate('/renter');
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Invalid OTP or user not found');
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
          {otpSent ? 'Enter the 6-digit code sent to you' : 'Enter your email or phone number to continue'}
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

            <div className="text-center mt-4 flex justify-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button"
                onClick={() => { setOtpSent(false); setOtp(''); }}
                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}
              >
                Change Details
              </button>
              <button 
                type="button"
                onClick={handleSendOtp}
                disabled={resendTimer > 0}
                style={{ color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--primary-color)', fontSize: '0.875rem', fontWeight: '500' }}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
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
