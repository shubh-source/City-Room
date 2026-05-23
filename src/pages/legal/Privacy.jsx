import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Back
        </button>

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Privacy Policy</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: May 2026</p>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, and payment information.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. Specifically, we use it to verify your identity (KYC), process escrow transactions, send support and administrative messages, and communicate with you about products, services, offers, and events.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We also share limited necessary information between Owners and Renters to facilitate property viewings and agreements.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>4. Data Security</h2>
            <p>In compliance with the Information Technology Act 2000, we take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>5. Your Rights</h2>
            <p>You may update, correct, or delete your account information at any time by logging into your account. If you wish to permanently delete your account and all associated data, please contact our support team.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
