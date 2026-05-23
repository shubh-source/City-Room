import React, { useState } from 'react';
import { Camera, MapPin, List, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const AddRoom = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    rent: '',
    advance: '',
    type: '1BHK',
    amenities: []
  });

  const amenitiesList = ['WiFi', 'AC', 'Attached Bath', 'Furnished', 'Parking', 'Balcony'];

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', {
        title: `${formData.type} in ${formData.city}`,
        address: formData.address,
        city: formData.city,
        rent: formData.rent,
        advance: formData.advance,
        type: formData.type,
        amenities: formData.amenities,
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop'] // Dummy photo for now
      });
      alert('Room listed successfully!');
      navigate('/owner');
    } catch (err) {
      alert('Failed to list room');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add New Room</h1>
        <p style={{ color: 'var(--text-secondary)' }}>List your property and start getting renters today.</p>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0, transform: 'translateY(-50%)' }} />
        
        {[{ id: 1, icon: <MapPin size={18}/>, label: 'Location' },
          { id: 2, icon: <List size={18}/>, label: 'Details' },
          { id: 3, icon: <Camera size={18}/>, label: 'Photos' }
        ].map((s) => (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: step >= s.id ? 'var(--primary-color)' : 'var(--surface-color)',
              color: step >= s.id ? 'white' : 'var(--text-muted)',
              border: `2px solid ${step >= s.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
              transition: 'all 0.3s ease'
            }}>
              {step > s.id ? <CheckCircle size={18} /> : s.icon}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: step >= s.id ? '600' : '500', color: step >= s.id ? 'var(--primary-color)' : 'var(--text-muted)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <form onSubmit={step === 3 ? submitForm : (e) => { e.preventDefault(); handleNext(); }}>
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Location Details</h2>
              <div className="input-group">
                <label className="input-label">City</label>
                <select className="input-field" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required>
                  <option value="">Select City</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Kota">Kota</option>
                  <option value="Bikaner">Bikaner</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Complete Address</label>
                <textarea 
                  className="input-field" 
                  rows={3} 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="House No, Street, Landmark"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Room Details & Pricing</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Monthly Rent (₹)</label>
                  <input type="number" className="input-field" value={formData.rent} onChange={e => setFormData({...formData, rent: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Advance Deposit (₹)</label>
                  <input type="number" className="input-field" value={formData.advance} onChange={e => setFormData({...formData, advance: e.target.value})} required />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Room Type</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Single Room">Single Room</option>
                  <option value="1RK">1 RK</option>
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Amenities</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {amenitiesList.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        border: `1px solid ${formData.amenities.includes(amenity) ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        backgroundColor: formData.amenities.includes(amenity) ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                        color: formData.amenities.includes(amenity) ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Upload Photos</h2>
              <div style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'var(--bg-color)',
                cursor: 'pointer'
              }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                  <Camera size={32} color="var(--primary-color)" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: '600' }}>Click to upload photos</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Add at least 3 photos (Max 5MB each)</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handlePrev} 
              style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button type="submit" className="btn btn-primary">
              {step === 3 ? 'List Property' : 'Next Step'} {step !== 3 && <ArrowRight size={18} />}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddRoom;
