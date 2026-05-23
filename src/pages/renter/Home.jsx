import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Filter, Star, X } from 'lucide-react';
import { api } from '../../lib/api';

const RenterHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [maxRent, setMaxRent] = useState(15000);
  const [roomType, setRoomType] = useState('All');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.get('/rooms');
        setRooms(data);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = r.rent <= maxRent;
    const matchesType = roomType === 'All' || r.type === roomType;
    return matchesSearch && matchesRent && matchesType;
  });

  const activeFilterCount = (maxRent < 15000 ? 1 : 0) + (roomType !== 'All' ? 1 : 0);

  return (
    <div className="animate-fade-in">
      {/* Search and Filters */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search by area, landmark or room type..." 
            style={{ paddingLeft: '3rem', borderRadius: '2rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className={`btn ${activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`} 
          style={{ borderRadius: '2rem', position: 'relative' }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} /> Filters
          {activeFilterCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="card animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '1rem', width: '320px', zIndex: 50 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 'bold' }}>Filters</h3>
              <button onClick={() => setShowFilters(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Max Rent <span>₹{maxRent}</span>
              </label>
              <input 
                type="range" 
                min="2000" 
                max="15000" 
                step="500" 
                value={maxRent}
                onChange={e => setMaxRent(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Room Type</label>
              <select className="input-field" value={roomType} onChange={e => setRoomType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Single Room">Single Room</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => { setMaxRent(15000); setRoomType('All'); }}
              >
                Clear All
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Available in Jaipur</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredRooms.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No rooms found matching your filters.</p>
        ) : (
          filteredRooms.map(room => (
            <Link key={room.id} to={`/renter/room/${room.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
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
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {room.type}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RenterHome;
