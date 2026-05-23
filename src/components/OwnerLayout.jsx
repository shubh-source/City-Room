import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Building, MessageSquare, LogOut, User } from 'lucide-react';

const OwnerLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/owner', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/owner/rooms', icon: <Building size={20} />, label: 'My Rooms' },
    { path: '/owner/add-room', icon: <PlusCircle size={20} />, label: 'Add Room' },
    { path: '/owner/enquiries', icon: <MessageSquare size={20} />, label: 'Enquiries' },
    { path: '/owner/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar Navigation */}
      <nav style={{ 
        width: '250px', 
        backgroundColor: 'var(--surface-color)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <img src="/logo.png" alt="CityRoom Logo" style={{ height: '40px', objectFit: 'contain' }} />
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

        <Link 
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--danger-color)',
            fontWeight: '500',
            marginTop: 'auto'
          }}
        >
          <LogOut size={20} />
          Logout
        </Link>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
