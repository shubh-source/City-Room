import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart, User, LogOut, MessageSquare, CreditCard, Bell, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const RenterLayout = () => {
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { path: '/renter', icon: <Search size={20} />, label: 'Find Rooms' },
    { path: '/renter/saved', icon: <Heart size={20} />, label: 'Shortlists' },
    { path: '/renter/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/support', icon: <MessageSquare size={20} />, label: 'Support' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Top Navigation Bar */}
      <nav className="top-nav-mobile" style={{ 
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
          <img src="/logo.png" alt="CityRoom Logo" style={{ height: '32px', margin: 0, objectFit: 'contain', borderRadius: '8px' }} />
          
          <div className="desktop-only" style={{ gap: '1rem' }}>
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
            <span style={{ fontWeight: '500', fontSize: '0.9rem', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {useContext(AppContext).userLocation.split(',')[0]}
            </span>
          </div>
          
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }} />
          
          <div style={{ position: 'relative' }}>
            <div 
              style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} />
            </div>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="animate-fade-in card" style={{ 
                position: 'absolute', top: '150%', right: '-50px', width: '320px', 
                padding: '0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>Notifications</h3>
                  <button onClick={() => setIsNotificationsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '300px', overflowY: 'auto', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No new notifications.
                </div>
                <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
                  <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Mark all as read</span>
                </div>
              </div>
            )}
          </div>

          <Link to="/renter/profile" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <User size={18} />
            </div>
          </Link>

          <button onClick={() => { localStorage.removeItem('cityroom_user'); localStorage.removeItem('cityroom_token'); window.location.href = '/'; }} style={{ color: 'var(--danger-color)', marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="layout-container" style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="mobile-only mobile-bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/renter' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default RenterLayout;
