import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, MapPin, Heart, Star } from 'lucide-react';
import { api } from '../../lib/api';

const Saved = () => {
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlists = async () => {
    try {
      const token = localStorage.getItem('cityroom_token');
      const res = await fetch('http://localhost:5000/api/shortlists', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setShortlists(data);
    } catch (err) {
      console.error('Failed to fetch shortlists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlists();
  }, []);

  const toggleShortlist = async (roomId) => {
    try {
      const token = localStorage.getItem('cityroom_token');
      await fetch(`http://localhost:5000/api/shortlist/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Re-fetch shortlists to remove un-shortlisted rooms
      fetchShortlists();
    } catch (err) {
      console.error('Failed to toggle shortlist', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Shortlists</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Rooms you have saved to view later.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading shortlists...</p>
      ) : shortlists.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No rooms saved yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Tap the heart icon on any room you like to save it here.
          </p>
          <Link to="/renter" className="btn btn-primary">Find Rooms</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {shortlists.map(item => {
            const room = item.room;
            return (
              <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={room.photos[0]} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', top: '1rem', right: '1rem', 
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white',
                    padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" /> {room.rating}
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleShortlist(room.id); }}
                    style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  >
                    <Heart size={20} fill="#EF4444" color="#EF4444" />
                  </button>
                </div>
                
                <Link to={`/renter/room/${room.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{room.title}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <MapPin size={16} /> {room.address}
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                      <IndianRupee size={18} /> {room.rent} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ month</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                      {room.type}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Saved;
