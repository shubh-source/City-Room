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
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>1. Data Collection under DPDP Act</h2>
            <p>In accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, we collect information you provide directly to us with your explicit consent. This includes your name, email, phone number, Aadhaar/PAN details (for KYC verification), and payment information required to facilitate secure rentals.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>2. Data Purpose & Processing</h2>
            <p>We process your personal data strictly for legitimate purposes related to property rental. This includes identity verification (KYC), fraud prevention, and escrow transaction processing. We do not sell your data or use it for targeted advertising without your explicit, withdrawable consent.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>3. Information Sharing & Third Parties</h2>
            <p>We share limited, necessary information between Owners and Renters to facilitate property viewings and agreements. We may also share data with verified third-party KYC providers and payment gateways compliant with the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>4. Data Security</h2>
            <p>In compliance with the <strong>Information Technology Act, 2000</strong>, we implement robust, industry-standard security measures (including encryption and secure nodal accounts) to protect your sensitive personal data from unauthorized access, disclosure, or alteration.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>5. Your Rights as a Data Principal</h2>
            <p>Under the DPDP Act, you have the right to access, update, correct, or erase your personal data at any time. You may also withdraw your consent for data processing by deleting your account. To exercise your rights or contact our Data Protection Officer (DPO), please reach out to our support team.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
