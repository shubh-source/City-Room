import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { User, Mail, Smartphone, CheckCircle, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'renter';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) return alert('Enter a valid 10-digit phone number');
    
    setLoading(true);
    try {
      await api.post('/auth/signup', { ...formData, role });
      setStep(2); // Move to OTP step
    } catch (err) {
      alert(err.message || 'Signup failed. User might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    
    setLoading(true);
    try {
      const data = await api.post('/auth/verify-signup', { ...formData, role, otp });
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
          Create {role === 'owner' ? 'Owner' : 'Renter'} Account
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {step === 1 ? 'Enter your details to register' : 'Enter the 4-digit code sent to your phone/email'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="tel" 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-4" 
              style={{ width: '100%', padding: '0.875rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>

            <div className="text-center mt-4">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Already have an account? <Link to={`/login?role=${role}`} style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link>
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
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: '500' }}
              >
                Change Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
