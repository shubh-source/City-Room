import React, { useState } from 'react';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';

const OwnerEnquiries = () => {
  const [activeTab, setActiveTab] = useState('enquiries');

  const enquiries = [
    { id: 1, name: 'Amit Kumar', room: '1 BHK in Malviya Nagar', date: '2 hours ago', status: 'pending' },
    { id: 2, name: 'Suresh Sharma', room: 'Single Room near University', date: '1 day ago', status: 'contacted' },
  ];

  const payments = [
    { id: 1, name: 'Rahul Verma', room: '1 BHK in Malviya Nagar', type: 'Advance (Escrow)', amount: '₹2,000', status: 'held', date: 'May 1, 2026' },
    { id: 2, name: 'Priya Patel', room: 'Single Room near University', type: 'Monthly Rent (Offline)', amount: '₹8,000', status: 'awaiting_confirmation', date: 'May 3, 2026' },
  ];

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
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{enq.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Interested in: <strong>{enq.room}</strong></p>
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{pay.amount} from {pay.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For: {pay.room}</p>
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
