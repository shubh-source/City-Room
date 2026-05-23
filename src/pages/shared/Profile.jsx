import React, { useState } from 'react';
import { User, Mail, MapPin, Save, Shield, Wallet } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const isOwner = location.pathname.includes('/owner');
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Shubh Kumar',
    email: 'shubh@example.com',
    phone: '+91 9876543210',
    location: 'Jaipur, Rajasthan',
    upiId: 'shubh@okhdfcbank',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here we would normally save to backend
    alert('Profile updated successfully!');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details and account settings.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {profileData.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profileData.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              <Shield size={16} /> Verified {isOwner ? 'Owner' : 'User'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem' }}
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
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
                value={profileData.email}
                onChange={e => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Location (City, State)</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem' }}
                value={profileData.location}
                onChange={e => setProfileData({...profileData, location: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isOwner && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Payout Details</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Enter your UPI ID or Bank Details to receive payments from Escrow when renters move in.
              </p>
              <div className="input-group">
                <label className="input-label">UPI ID / Account Number</label>
                <div style={{ position: 'relative' }}>
                  <Wallet size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={profileData.upiId}
                    placeholder="e.g., yourname@upi"
                    onChange={e => setProfileData({...profileData, upiId: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Save Changes</button>
              </div>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
