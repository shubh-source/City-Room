import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Star, Shield, ArrowLeft, Check, ShieldCheck } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock data
  const room = {
    id: '101',
    title: '1 BHK in Malviya Nagar',
    address: 'Sector 4, Malviya Nagar, Jaipur',
    rent: 5000,
    advance: 2000,
    type: '1 BHK',
    rating: 4.8,
    reviews: 12,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=600&auto=format&fit=crop'
    ],
    amenities: ['WiFi', 'AC', 'Attached Bath', 'Furnished'],
    owner: {
      name: 'Ramesh Singh',
      verified: true,
      memberSince: 'Jan 2024'
    },
    description: 'Beautiful and spacious 1 BHK located in the heart of Malviya Nagar. Close to market and public transport. Perfect for students and working professionals.'
  };

  const handlePayAdvance = () => {
    // Escrow payment logic
    alert('Redirecting to secure payment gateway...');
    navigate('/renter/payments');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/renter')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Search
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column - Details */}
        <div>
          {/* Photo Gallery */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', height: '400px', display: 'flex', gap: '0.5rem' }}>
            <img src={room.photos[0]} alt="Room main" style={{ width: '66%', height: '100%', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '34%' }}>
              <img src={room.photos[1]} alt="Room view 2" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
              <div style={{ width: '100%', height: '50%', backgroundColor: 'var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontWeight: 'bold' }}>+3 more photos</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{room.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={18} /> {room.address}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>
              <Star size={16} fill="#D97706" /> {room.rating} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>({room.reviews})</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>About this room</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>{room.description}</p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Amenities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {room.amenities.map(amenity => (
              <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={18} color="var(--secondary-color)" /> {amenity}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
              <IndianRupee size={24} />
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{room.rent}</span>
              <span style={{ color: 'var(--text-secondary)' }}>/ month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Advance Deposit</span>
                <span style={{ fontWeight: '600' }}>₹{room.advance}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Platform Fee</span>
                <span style={{ fontWeight: '600' }}>₹{Math.round(room.advance * 0.05)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total to Pay Now</span>
                <span style={{ color: 'var(--primary-color)' }}>₹{room.advance + Math.round(room.advance * 0.05)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={() => setShowPaymentModal(true)}
            >
              <ShieldCheck size={20} /> Secure Room (Escrow)
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
              Your money is held securely until you move in.
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '1.5rem' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
                {room.owner.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold' }}>{room.owner.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
                  <Shield size={14} /> Verified Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal Simulation */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Secure Payment</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
              Pay ₹{room.advance + Math.round(room.advance * 0.05)} via Escrow to secure this room.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn" style={{ backgroundColor: '#10B981', color: 'white' }} onClick={handlePayAdvance}>
                Pay via UPI
              </button>
              <button className="btn btn-outline" onClick={handlePayAdvance}>
                Pay via Card / Netbanking
              </button>
              <button className="btn" style={{ color: 'var(--text-secondary)' }} onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
