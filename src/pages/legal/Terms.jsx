import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Back
        </button>

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Terms of Service</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: May 2026</p>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h2>
            <p>By accessing and using CityRoom, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>2. User Obligations & KYC</h2>
            <p>Users must provide accurate, current, and complete information during registration. Both owners and renters are required to undergo KYC verification before finalizing any rental agreements. Providing false information is grounds for immediate account termination.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>3. The Escrow Payment Model</h2>
            <p>To prevent fraud, CityRoom utilizes an Escrow payment model. Rent and advance payments made by the renter are held securely by CityRoom. Funds are only released to the owner after the renter has successfully moved into the property and verified its condition.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>4. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the platform; (ii) transmitting spam or unauthorized advertising; (iii) attempting to interfere with the platform's security; (iv) posting fraudulent property listings.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>5. Limitation of Liability</h2>
            <p>CityRoom acts solely as a facilitator between property owners and renters. We do not guarantee the condition of any property listed on the platform. Any disputes arising from the rental agreement are strictly between the owner and the renter.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
