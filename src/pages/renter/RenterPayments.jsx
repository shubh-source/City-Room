import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock, FileText } from 'lucide-react';

const RenterPayments = () => {
  const payments = [
    { id: 1, type: 'Advance', amount: '₹2,000', status: 'In Escrow', date: 'May 4, 2026', room: '1 BHK in Malviya Nagar', owner: 'Ramesh Singh' },
    { id: 2, type: 'Monthly Rent', amount: '₹8,000', status: 'Paid Offline', date: 'Apr 1, 2026', room: '1 BHK in Malviya Nagar', owner: 'Ramesh Singh' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your escrow deposits and monthly rent payments.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {payments.map(payment => (
          <div key={payment.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 'bold',
                  backgroundColor: payment.status === 'In Escrow' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: payment.status === 'In Escrow' ? 'var(--primary-color)' : 'var(--secondary-color)'
                }}>
                  {payment.status}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.date}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{payment.amount}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{payment.type} for {payment.room}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <FileText size={16} /> View Receipt
              </button>
              {payment.status === 'In Escrow' && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Releases to owner on move-in</span>
              )}
            </div>
          </div>
        ))}

        <div className="card" style={{ border: '2px dashed var(--border-color)', backgroundColor: 'transparent', textAlign: 'center', padding: '3rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%', marginBottom: '1rem' }}>
            <CreditCard size={32} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Next Rent Due</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You don't have any upcoming payments for this month.</p>
          <button className="btn btn-primary">Pay Rent Now</button>
        </div>
      </div>
    </div>
  );
};

export default RenterPayments;
