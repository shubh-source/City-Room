import React, { useState, useEffect } from 'react';
import { Home, Users, IndianRupee, TrendingUp, Bell, AlertTriangle, Wallet, Star } from 'lucide-react';
import { api } from '../../lib/api';

const DashboardCard = ({ title, value, icon, color, trend }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
      <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
      <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</span>
      {trend && (
        <span style={{ fontSize: '0.875rem', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center' }}>
          <TrendingUp size={14} style={{ marginRight: '0.25rem' }} /> {trend}
        </span>
      )}
    </div>
  </div>
);

const OwnerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTenants, setActiveTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, notifData, bookingsData] = await Promise.all([
          api.get('/owner/rooms'),
          api.get('/notifications'),
          api.get('/owner/bookings')
        ]);
        setRooms(roomsData);
        setNotifications(notifData);
        
        // Active tenants are renters who have completed or escrow bookings
        const tenants = bookingsData
          .filter(b => b.status === 'completed' || b.status === 'escrow')
          .map(b => ({
            id: b.id,
            renterId: b.renterId,
            roomId: b.roomId,
            name: b.renter?.name || 'Tenant',
            roomTitle: b.room?.title || 'Room',
            daysAgo: Math.floor((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24))
          }));
        setActiveTenants(tenants);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRooms = rooms.length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const vacant = rooms.filter(r => r.status === 'vacant').length;
  const monthlyIncome = rooms.filter(r => r.status === 'occupied').reduce((acc, r) => acc + r.rent, 0);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening with your properties.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <DashboardCard 
          title="Total Rooms" 
          value={totalRooms} 
          icon={<Home size={24} />} 
          color="var(--primary-color)" 
        />
        <DashboardCard 
          title="Occupied" 
          value={occupied} 
          icon={<Users size={24} />} 
          color="var(--secondary-color)" 
        />
        <DashboardCard 
          title="Vacant" 
          value={vacant} 
          icon={<Home size={24} />} 
          color="var(--danger-color)" 
        />
        <DashboardCard 
          title="Monthly Income" 
          value={`₹${monthlyIncome}`} 
          icon={<IndianRupee size={24} />} 
          color="#F59E0B" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Notifications Panel */}
        <div className="card" style={{ background: 'linear-gradient(to right, rgba(239, 68, 68, 0.05), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bell size={20} color="var(--danger-color)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Live Notifications</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No new notifications.</p>
            ) : (
              notifications.slice(0, 5).map(notif => (
                <div key={notif.id} style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-color)', 
                  border: '1px solid var(--border-color)', 
                  borderLeft: '4px solid var(--danger-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem'
                }}>
                  {notif.message}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Enquiries</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No recent enquiries yet.</p>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Active Tenants</h2>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Review Unlocked</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              You can only review tenants after they have shifted in.
            </p>
            {activeTenants.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No active tenants yet.</p>
            ) : (
              activeTenants.map(tenant => (
                <div key={tenant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>{tenant.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Shifted to {tenant.roomTitle} ({tenant.daysAgo === 0 ? 'Today' : `${tenant.daysAgo} days ago`})</p>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Review system opened for ' + tenant.name)}>
                    <Star size={16} /> Write Review
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
