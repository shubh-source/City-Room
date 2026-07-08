import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Building, MessageSquare, LogOut, User } from 'lucide-react';

const OwnerLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/owner', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/owner/rooms', icon: <Building size={20} />, label: 'My Rooms' },
    { path: '/owner/add-room', icon: <PlusCircle size={20} />, label: 'Add Room' },
    { path: '/owner/enquiries', icon: <MessageSquare size={20} />, label: 'Enquiries' },
    { path: '/support', icon: <MessageSquare size={20} />, label: 'Help & Support' },
    { path: '/owner/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar Navigation (Desktop) */}
      <nav className="desktop-only" style={{ 
        width: '250px', 
        backgroundColor: 'var(--surface-color)', 
        borderRight: '1px solid var(--border-color)',
        flexDirection: 'column',
        padding: '1.5rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <img src="/logo.png" alt="CityRoom Logo" style={{ height: '40px', objectFit: 'contain', borderRadius: '8px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', fontWeight: '600' }}>Owner Portal</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </div>

        <button 
          onClick={() => { localStorage.removeItem('cityroom_user'); localStorage.removeItem('cityroom_token'); window.location.href = '/'; }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--danger-color)',
            fontWeight: '500',
            marginTop: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>from</span>
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary-color)', letterSpacing: '0.5px' }}>UDVerse</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="layout-container" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="mobile-only mobile-bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
};

export default OwnerLayout;
