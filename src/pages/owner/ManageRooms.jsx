import React, { useState } from 'react';
import { MapPin, IndianRupee, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([
    {
      id: '101',
      title: '1 BHK in Malviya Nagar',
      address: 'Sector 4, Malviya Nagar, Jaipur',
      rent: 5000,
      status: 'vacant',
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop'],
    },
    {
      id: '102',
      title: 'Single Room near University',
      address: 'Raja Park, Jaipur',
      rent: 8000,
      status: 'occupied',
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=600&auto=format&fit=crop'],
    }
  ]);

  const toggleStatus = (id) => {
    setRooms(rooms.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'vacant' ? 'occupied' : 'vacant' };
      }
      return r;
    }));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Rooms</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your property listings and their availability.</p>
        </div>
        <button className="btn btn-primary">
          List New Room
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {rooms.map(room => (
          <div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '200px' }}>
              <img src={room.photos[0]} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ 
                position: 'absolute', top: '1rem', right: '1rem', 
                backgroundColor: room.status === 'vacant' ? 'var(--secondary-color)' : 'var(--text-secondary)',
                color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
              }}>
                {room.status}
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{room.title}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} /> {room.address}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                <IndianRupee size={18} /> {room.rent} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ month</span>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem' }} title="Edit">
                    <Edit size={16} />
                  </button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger-color)' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => toggleStatus(room.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: room.status === 'vacant' ? 'var(--secondary-color)' : 'var(--text-secondary)' }}
                >
                  {room.status === 'vacant' ? 'Mark Occupied' : 'Mark Vacant'}
                  {room.status === 'vacant' ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRooms;
