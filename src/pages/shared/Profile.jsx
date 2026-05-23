import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, MapPin, Save, Shield, Wallet } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const Profile = () => {
  const locationHook = useLocation();
  const isOwner = locationHook.pathname.includes('/owner');
  
  const { user, userLocation, setUserLocation } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  
  // Autocomplete states
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    email: '...',
    phone: '...',
    location: userLocation,
    upiId: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'User',
        email: user.email || user.phone || 'No contact info',
        phone: user.phone || '',
        location: userLocation,
        upiId: user.upiId || 'not-set@upi',
      });
    }
  }, [user, userLocation]);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setProfileData({...profileData, location: query});
    
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&countrycodes=in&format=json&limit=5`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Autocomplete failed", err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCity = (cityData) => {
    // Construct clean city name (e.g. Kanpur, Uttar Pradesh)
    const cleanName = cityData.display_name.split(',').slice(0, 2).join(', ');
    setProfileData({...profileData, location: cleanName});
    setSearchResults([]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setUserLocation(profileData.location);
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

          <div className="input-group" style={{ position: 'relative' }}>
            <label className="input-label">Location (City, State)</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '2.5rem' }}
                value={profileData.location}
                onChange={handleLocationChange}
                disabled={!isEditing}
                placeholder="Type your city..."
                autoComplete="off"
              />
            </div>
            {/* Autocomplete Dropdown */}
            {isEditing && searchResults.length > 0 && (
              <ul className="autocomplete-dropdown">
                {searchResults.map((result, idx) => (
                  <li 
                    key={idx} 
                    className="autocomplete-item"
                    onClick={() => handleSelectCity(result)}
                  >
                    {result.display_name.split(',').slice(0, 3).join(',')}
                  </li>
                ))}
              </ul>
            )}
            {isEditing && isSearching && searchResults.length === 0 && (
              <ul className="autocomplete-dropdown">
                <li className="autocomplete-item" style={{ color: 'var(--text-muted)' }}>Searching...</li>
              </ul>
            )}
          </div>

          {isOwner ? (
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
          ) : (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>KYC Verification</h3>
                <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold' }}>Pending Verification</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Upload your Aadhar or PAN card to complete your KYC. This builds trust with owners and enables instant booking.
              </p>
              
              <div className="input-group">
                <label className="input-label">Document Type</label>
                <select 
                  className="input-field" 
                  disabled={!isEditing}
                  defaultValue="aadhar"
                >
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Document Number</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Enter ID Number"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Upload Document Photo</label>
                <input 
                  type="file" 
                  className="input-field" 
                  disabled={!isEditing}
                  accept="image/*,.pdf"
                  style={{ padding: '0.6rem 1rem' }}
                />
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
