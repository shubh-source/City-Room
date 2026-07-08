import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock, FileText, IndianRupee, Banknote, X } from 'lucide-react';
import { api } from '../../lib/api';

const RenterPayments = () => {
  const location = useLocation();
  const roomToBook = location.state?.room;

  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(!!roomToBook);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.get('/bookings');
        setPayments(data.map(b => ({
          id: b.id,
          type: 'Advance (Escrow)',
          amount: `₹${b.amountPaid + b.platformFee}`,
          status: b.status === 'completed' ? 'Confirmed' : b.status === 'escrow' ? 'In Escrow' : 'Pending Confirmation',
          date: new Date(b.createdAt).toLocaleDateString(),
          room: b.room.title,
          owner: b.room.owner?.name || 'Owner'
        })));
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setFetching(false);
      }
    };
    fetchBookings();
  }, []);

  const handlePay = async (method) => {
    if (!roomToBook) return;
    setLoading(true);
    try {
      const amountPaid = roomToBook.advance;
      const platformFee = Math.round(roomToBook.advance * 0.05);
      
      const newBooking = await api.post('/bookings', {
        roomId: roomToBook.id,
        amountPaid,
        platformFee,
        status: method === 'online' ? 'escrow' : 'pending',
        durationMonths: duration
      });
      
      setPayments([
        { 
          id: newBooking.id, 
          type: 'Advance (Escrow)', 
          amount: `₹${amountPaid + platformFee}`, 
          status: method === 'online' ? 'In Escrow' : 'Pending Confirmation', 
          date: 'Just now', 
          room: roomToBook.title, 
          owner: roomToBook.owner?.name || 'Owner' 
        },
        ...payments
      ]);
      
      setIsModalOpen(false);
      alert(method === 'online' ? 'Payment Successful! Secured via Escrow.' : 'Offline Payment marked. Waiting for owner to confirm.');
    } catch (err) {
      console.error(err);
      alert('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Paid Online' || status === 'Confirmed') return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' };
    if (status === 'Pending Confirmation') return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' };
    return { bg: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' };
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Pay your rent, track escrow deposits, and view payment history.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        


        {/* Payment History */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Payment History</h3>
        
        {payments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No payment history found.
          </div>
        ) : (
          payments.map(payment => {
            const style = getStatusStyle(payment.status);
            return (
              <div key={payment.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: style.bg, color: style.color
                    }}>
                      {payment.status}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{payment.amount}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{payment.type} - {payment.owner}</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    <FileText size={16} /> Receipt
                  </button>
                  {payment.status === 'Pending Confirmation' && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--warning-color)' }}>Owner must confirm cash</span>
                  )}
                  {payment.status === 'In Escrow' && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Releases on move-in</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="card animate-fade-in" style={{ width: '90%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => !loading && setIsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select Payment Method</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {roomToBook ? `Pay ₹${roomToBook.advance + Math.round(roomToBook.advance * 0.05)} to secure ${roomToBook.title}` : 'Select a payment method.'}
            </p>

            {roomToBook && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Duration of Stay</label>
                <select 
                  className="input-field" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={11}>11 Months</option>
                  <option value={12}>1 Year +</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => handlePay('online')}
                disabled={loading}
                className="btn" 
                style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}
              >
                <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}><CreditCard size={20} /></div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: 'bold' }}>{loading ? 'Processing...' : 'Pay Online (UPI / Card)'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant approval & receipt</span>
                </div>
              </button>

              <button 
                onClick={() => handlePay('offline')}
                disabled={loading}
                className="btn btn-outline" 
                style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}
              >
                <div style={{ background: 'var(--surface-color)', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-secondary)' }}><Banknote size={20} /></div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: 'bold' }}>Pay Offline (Cash)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requires owner confirmation</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenterPayments;
