import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, Clock, Star } from 'lucide-react';
import { api } from '../../lib/api';

const OwnerEnquiries = () => {
  const [activeTab, setActiveTab] = useState('enquiries');

  const [enquiries, setEnquiries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Enquiries are mock for now as we haven't implemented full enquiry messaging. 
        // We will fetch bookings (payments) from backend.
        const bookingsData = await api.get('/owner/bookings');
        
        setPayments(bookingsData.map(b => ({
          id: b.id,
          name: b.renter?.legalName || b.renter?.name || 'User',
          phone: b.renter?.phone,
          address: b.renter?.legalAddress,
          dob: b.renter?.dob,
          room: b.room?.title || 'Room',
          type: 'Advance (Escrow)',
          amount: `₹${b.amountPaid + b.platformFee}`,
          duration: b.durationMonths || 1,
          status: b.status === 'completed' ? 'confirmed' : b.status === 'escrow' ? 'held' : 'awaiting_confirmation',
          date: new Date(b.createdAt).toLocaleDateString()
        })));

        // Mock enquiries for demo purposes since they represent people who just messaged but haven't paid yet.
        setEnquiries([
          { id: 1, name: 'Amit Kumar', room: '1 BHK in Malviya Nagar', date: '2 hours ago', status: 'pending' }
        ]);
      } catch (err) {
        console.error('Failed to fetch owner data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Enquiries & Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage prospective renters and track payments.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('enquiries')}
          style={{ 
            padding: '1rem 0', fontWeight: '600', 
            color: activeTab === 'enquiries' ? 'var(--primary-color)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'enquiries' ? '2px solid var(--primary-color)' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Enquiries ({enquiries.length})
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          style={{ 
            padding: '1rem 0', fontWeight: '600', 
            color: activeTab === 'payments' ? 'var(--primary-color)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'payments' ? '2px solid var(--primary-color)' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Payments & Escrow ({payments.length})
        </button>
      </div>

      {activeTab === 'enquiries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {enquiries.map(enq => (
            <div key={enq.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{enq.name}</h3>
                  <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                    <Star size={12} fill="#D97706" /> 4.8
                  </span>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    Read Reviews
                  </button>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem', marginTop: '0.25rem' }}>Interested in: <strong>{enq.room}</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} /> {enq.date}
                </div>
              </div>
              <div>
                <button className="btn" style={{ backgroundColor: '#25D366', color: 'white' }}>
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payments.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No payments or bookings yet.</p>}
          {payments.map(pay => (
            <div key={pay.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 'bold',
                    backgroundColor: pay.status === 'held' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: pay.status === 'held' ? 'var(--primary-color)' : '#F59E0B'
                  }}>
                    {pay.type}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pay.date}</span>
                </div>
                <h4 style={{ fontWeight: 'bold' }}>{pay.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pay.phone}</p>
                {(pay.address || pay.dob) && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {pay.dob && <span>DOB: {pay.dob}</span>}
                    {pay.dob && pay.address && <span> &bull; </span>}
                    {pay.address && <span>{pay.address}</span>}
                  </div>
                )}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{pay.amount} from {pay.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For: {pay.room} ({pay.duration} month{pay.duration > 1 ? 's' : ''})</p>
              </div>
              
              <div>
                {pay.status === 'held' ? (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Held in Escrow</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Releases on move-in</p>
                  </div>
                ) : (
                  <button className="btn btn-secondary">
                    <CheckCircle size={18} /> Confirm Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerEnquiries;
