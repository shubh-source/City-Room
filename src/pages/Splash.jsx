import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Key } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('homedo_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === 'owner') navigate('/owner');
        else navigate('/renter');
      } catch (e) {
        console.error("Invalid user session");
      }
    }
  }, [navigate]);

  return (
    <div className="flex-center p-8 animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div className="mb-8 flex-center" style={{ flexDirection: 'column' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
          boxShadow: '0 8px 32px var(--primary-glow)'
        }}>
          <img src="/logo.png" alt="HomeDo Logo" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '12px' }} />
        </div>
        <h1 className="font-bold mb-2" style={{ 
          fontSize: '3rem', 
          background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>HomeDo</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '300px', margin: '0 auto' }}>Find your perfect room in the city, or list yours today.</p>
      </div>

      <div className="card w-full max-w-md" style={{ maxWidth: '400px', width: '100%', position: 'relative', zIndex: 1 }}>
        <h2 className="font-bold mb-4" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>How do you want to use HomeDo?</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/login?role=renter')}
            style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}
          >
            <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary-color)' }}>
              <Home size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontWeight: '600', fontSize: '1.1rem' }}>I am a Renter</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Looking for a room to rent</span>
            </div>
          </button>

          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/login?role=owner')}
            style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}
          >
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--secondary-color)' }}>
              <Key size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontWeight: '600', fontSize: '1.1rem' }}>I am an Owner</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>I have a room to list</span>
            </div>
          </button>
        </div>
      </div>

      {/* Founder Pitch Video Section */}
      <div className="card w-full max-w-md mt-6" style={{ maxWidth: '400px', width: '100%', position: 'relative', zIndex: 1, padding: '1.5rem', textAlign: 'center' }}>
        <h3 className="font-bold mb-3" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Watch Our Story 🚀</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Listen to the founder pitch HomeDo.</p>
        
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <iframe 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/vxJh2FxU1Qw?si=7nz1OqUzTyINYO_f" 
            title="HomeDo Founder Pitch" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '3rem', width: '100%', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: '0 0.5rem', textDecoration: 'underline' }}>Terms of Service</button> | 
          <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: '0 0.5rem', textDecoration: 'underline' }}>Privacy Policy</button> | 
          <button onClick={() => navigate('/support')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: '0 0.5rem', textDecoration: 'underline' }}>Help & Support</button>
        </div>
        <p style={{ marginTop: '0.5rem' }}>&copy; 2026 HomeDo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Splash;
