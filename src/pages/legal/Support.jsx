import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Clock, MessageCircle } from 'lucide-react';

const Support = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Back
        </button>

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Help & Support</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We're here to help! Get in touch with the HomeDo team.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Phone size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Call Us</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Mon-Sat, 9am to 6pm</p>
              <a href="tel:9451560978" style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>+91 9451560978</a>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Mail size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Us</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>We reply within 24 hours</p>
              <a href="mailto:katiyar0586@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>katiyar0586@gmail.com</a>
            </div>
          </div>

        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>How does the Escrow payment work?</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>When a renter books a room, their payment is securely held by HomeDo. We only transfer the funds to the owner after the renter has successfully moved in and verified the property. This guarantees safety for both parties.</p>
          </div>

          <div style={{ backgroundColor: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>How can I request a refund?</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>If the room does not match the description or the owner cancels, you can request an instant refund before the move-in date. Just email our support team with your booking details.</p>
          </div>

          <div style={{ backgroundColor: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Is KYC mandatory?</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>Yes, to ensure the safety and trust of our community, both renters and owners must provide valid government-issued ID proof before finalizing any agreements.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
