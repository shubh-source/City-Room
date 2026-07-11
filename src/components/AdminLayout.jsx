import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert, Users, Home, IndianRupee, LogOut } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar Navigation */}
      <nav style={{ 
        width: '250px', 
        backgroundColor: '#0F172A', // Dark sidebar for admin
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem'
      }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={24} color="#F59E0B" />
          <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>HomeDo Admin</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '600' }}>
            <Home size={20} /> Overview
          </Link>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#94A3B8', fontWeight: '500' }}>
            <Users size={20} /> Users & Owners
          </Link>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#94A3B8', fontWeight: '500' }}>
            <Home size={20} /> Listings
          </Link>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#94A3B8', fontWeight: '500' }}>
            <IndianRupee size={20} /> Escrow & Payouts
          </Link>
        </div>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#EF4444', fontWeight: '500', marginTop: 'auto' }}>
          <LogOut size={20} /> Exit Admin
        </Link>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
