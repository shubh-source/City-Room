import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Star, Shield, ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  
  // Only true if the backend confirms they have stayed here. For demo, it is hardcoded to false.
  const isVerifiedTenant = false;

  // Fetch real data
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await api.get(`/rooms/${id}`);
        setRoom(roomData);
        
        const reviewsData = await api.get(`/rooms/${id}/reviews`);
        
        // Use real reviews if they exist, otherwise show some dummy ones for the pitch
        if (reviewsData && reviewsData.length > 0) {
          setReviewsList(reviewsData.map(r => ({
            id: r.id,
            author: r.reviewer?.legalName || r.reviewer?.name || 'User',
            rating: r.rating,
            date: new Date(r.createdAt).toLocaleDateString(),
            comment: r.comment
          })));
        } else {
          setReviewsList([
            { id: 1, author: 'Priya Sharma (Verified)', rating: 5, date: 'October 2023', comment: 'Very clean room and the owner is very helpful. Secured via CityRoom escrow.' },
            { id: 2, author: 'Amit Kumar (Verified)', rating: 4, date: 'August 2023', comment: 'Good location, smooth booking experience.' }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch room details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reviews', {
        roomId: id,
        targetUserId: room.ownerId,
        rating: newRating,
        comment: newReview
      });
      
      setReviewsList([
        { id: res.id, author: 'You', rating: res.rating, date: 'Just now', comment: res.comment },
        ...reviewsList
      ]);
      setShowReviewModal(false);
      setNewReview('');
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    }
  };

  const handlePayAdvance = () => {
    // Escrow payment logic
    navigate('/renter/payments', { state: { room } });
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading room details...</div>;
  if (!room) return <div style={{ padding: '4rem', textAlign: 'center' }}>Room not found!</div>;

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
            <img src={room.photos && room.photos[0] ? room.photos[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'} alt="Room main" style={{ width: '66%', height: '100%', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '34%' }}>
              <img src={room.photos && room.photos[1] ? room.photos[1] : 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=600&auto=format&fit=crop'} alt="Room view 2" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
              <div style={{ width: '100%', height: '50%', backgroundColor: 'var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontWeight: 'bold' }}>{room.photos && room.photos.length > 2 ? `+${room.photos.length - 2} more photos` : 'View more'}</span>
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
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>A premium {room.type} located in {room.city}. Best suited for professionals and students seeking a comfortable and verified stay.</p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Amenities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {room.amenities && room.amenities.map(amenity => (
              <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={18} color="var(--secondary-color)" /> {amenity}
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          {/* Reviews Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Verified Reviews</h3>
            {isVerifiedTenant ? (
              <button onClick={() => setShowReviewModal(true)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Star size={16} /> Write a Review
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: '2rem' }}>
                <ShieldCheck size={16} /> Only tenants who booked this room can review
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {reviewsList.map(review => (
              <div key={review.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{review.author}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "#D97706" : "transparent"} color={i < review.rating ? "#D97706" : "var(--border-color)"} />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{review.comment}</p>
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
                {room.owner?.legalName ? room.owner.legalName.charAt(0).toUpperCase() : (room.owner?.name ? room.owner.name.charAt(0).toUpperCase() : 'O')}
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold' }}>{room.owner?.legalName || room.owner?.name || 'Verified Owner'}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
                  <Shield size={14} /> Verified Owner
                </div>
                {room.owner?.legalAddress && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {room.owner.legalAddress}
                  </div>
                )}
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

      {/* Review Modal */}
      {showReviewModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Write a Review</h2>
            
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={24} 
                      style={{ cursor: 'pointer' }}
                      fill={star <= newRating ? "#D97706" : "transparent"} 
                      color={star <= newRating ? "#D97706" : "var(--border-color)"}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your Review</label>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  placeholder="Tell others about your stay..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowReviewModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
