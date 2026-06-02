import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Filter, Star, X, Heart, Map as MapIcon, Grid } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../../lib/api';
import { AppContext } from '../../context/AppContext';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RenterHome = () => {
  const { userLocation } = useContext(AppContext);
  const currentCity = userLocation.split(',')[0].trim();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  
  // Filter states
  const [maxRent, setMaxRent] = useState(15000);
  const [roomType, setRoomType] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, shortlistsData] = await Promise.all([
          api.get('/rooms'),
          api.get('/shortlists')
        ]);
        setRooms(roomsData);
        setShortlists(shortlistsData.map(s => s.roomId));
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRooms = rooms.filter(r => {
    // Location Filter
    const matchesLocation = r.address.toLowerCase().includes(currentCity.toLowerCase()) || currentCity === 'Fetching Location...' || currentCity === 'Select Location';
    
    // Search & Other Filters
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = r.rent <= maxRent;
    const matchesType = roomType === 'All' || r.type === roomType;
    return matchesLocation && matchesSearch && matchesRent && matchesType;
  });

  const toggleShortlist = async (roomId) => {
    try {
      const token = localStorage.getItem('cityroom_token');
      const res = await fetch(`https://cityroom-173301158154.europe-west1.run.app/api/shortlist/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.isShortlisted) {
        setShortlists([...shortlists, roomId]);
      } else {
        setShortlists(shortlists.filter(id => id !== roomId));
      }
    } catch (err) {
      console.error('Failed to toggle shortlist', err);
    }
  };

  const activeFilterCount = (maxRent < 15000 ? 1 : 0) + (roomType !== 'All' ? 1 : 0);

  // Generate deterministic dummy coordinates for map based on room ID
  const getDummyCoords = (roomStrId, baseLat = 26.8467, baseLng = 80.9462) => {
    // Basic hash to generate an offset
    let hash = 0;
    for (let i = 0; i < roomStrId.length; i++) hash += roomStrId.charCodeAt(i);
    const offsetLat = (hash % 100) * 0.0005 - 0.025;
    const offsetLng = ((hash * 2) % 100) * 0.0005 - 0.025;
    return [baseLat + offsetLat, baseLng + offsetLng];
  };

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
        
        <button 
          className="btn btn-outline" 
          style={{ borderRadius: '2rem', padding: '0.5rem 1rem' }}
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
        >
          {viewMode === 'grid' ? <><MapIcon size={18} /> Map</> : <><Grid size={18} /> Grid</>}
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

      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Available in {currentCity}</h2>

      {viewMode === 'map' ? (
        <div style={{ height: '600px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', zIndex: 1 }}>
          <MapContainer center={[26.8467, 80.9462]} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredRooms.map(room => (
              <Marker key={room.id} position={getDummyCoords(room.id)}>
                <Popup>
                  <div style={{ width: '200px' }}>
                    <img src={room.photos[0]} alt="Room" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>{room.title}</h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>{room.address}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#4F46E5' }}>₹{room.rent}/mo</strong>
                      <Link to={`/renter/room/${room.id}`} style={{ padding: '4px 8px', background: '#4F46E5', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '12px' }}>View</Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredRooms.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No rooms found matching your filters.</p>
          ) : (
            filteredRooms.map(room => {
              const isSaved = shortlists.includes(room.id);
              return (
              <div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
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
                    <Heart size={20} fill={isSaved ? "#EF4444" : "transparent"} color={isSaved ? "#EF4444" : "var(--text-muted)"} />
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
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {room.type}
                    </span>
                  </div>
                </Link>
              </div>
            )})
          )}
        </div>
      )}
    </div>
  );
};

export default RenterHome;
