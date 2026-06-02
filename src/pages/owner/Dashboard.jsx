import React, { useState, useEffect } from 'react';
import { Home, Users, IndianRupee, TrendingUp, Bell } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cityroom_token');
        const [roomsData, notifRes] = await Promise.all([
          api.get('/owner/rooms'),
          fetch('https://cityroom-173301158154.europe-west1.run.app/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        setRooms(roomsData);
        if (notifRes.ok) {
          setNotifications(await notifRes.json());
        }
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

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Enquiries</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div>
                  <h4 style={{ fontWeight: '600' }}>Ramesh Singh</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Interested in: Room 101, Malviya Nagar</p>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Contact via WhatsApp
                </button>
              </div>
            ))}
            <button className="btn" style={{ color: 'var(--primary-color)', alignSelf: 'flex-start', padding: 0 }}>
              View all enquiries &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
