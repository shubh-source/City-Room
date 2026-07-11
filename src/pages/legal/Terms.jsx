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
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>1. Acceptance of Terms & Regulatory Compliance</h2>
            <p>By accessing and using HomeDo, you agree to be bound by these Terms of Service. HomeDo operates as an intermediary in compliance with the <strong>Information Technology Act, 2000</strong> and the rules framed thereunder. If you do not agree to these terms, please do not use our platform.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>2. Tenancy Laws & KYC Obligations</h2>
            <p>Users must provide accurate information during registration. Both owners and renters are required to undergo KYC verification (e.g., Aadhaar/PAN) before finalizing any rental agreements. All rental agreements facilitated through HomeDo are subject to the <strong>Model Tenancy Act, 2021</strong> and applicable State Rent Control Acts. Providing false KYC information is a punishable offense.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>3. Escrow Payment & Financial Regulations</h2>
            <p>To prevent fraud, HomeDo utilizes a secure Escrow payment model in accordance with the <strong>Payment and Settlement Systems Act, 2007</strong> and RBI guidelines. Rent and advance payments made by the renter are held securely in a nodal/escrow account and are only released to the owner after the renter has successfully verified the property.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>4. Grievance Redressal</h2>
            <p>In compliance with the IT Rules, HomeDo has appointed a Grievance Officer to address any discrepancies or grievances related to the platform. Any disputes arising from the rental agreement itself must be resolved through the competent Rent Court or Rent Tribunal as per the applicable state laws.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>5. Limitation of Liability</h2>
            <p>HomeDo acts solely as a technology facilitator (intermediary) between property owners and renters. We do not guarantee the condition of any property listed on the platform. Any disputes arising from the rental agreement are strictly between the owner and the renter.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
