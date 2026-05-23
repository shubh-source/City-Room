import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, MapPin, CreditCard, User, LogOut } from 'lucide-react';

const RenterLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/renter', icon: <Search size={20} />, label: 'Find Rooms' },
    { path: '/renter/payments', icon: <CreditCard size={20} />, label: 'My Payments' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Top Navigation Bar */}
      <nav style={{ 
        backgroundColor: 'var(--surface-color)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img src="/logo.png" alt="CityRoom Logo" style={{ height: '32px', margin: 0, objectFit: 'contain' }} />
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/renter' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                    backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <MapPin size={18} />
            <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Jaipur</span>
          </div>
          
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }} />
          
          <Link to="/renter/profile" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <User size={18} />
            </div>
          </Link>

          <Link to="/" style={{ color: 'var(--danger-color)', marginLeft: '0.5rem' }} title="Logout">
            <LogOut size={20} />
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RenterLayout;
