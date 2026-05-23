import React from 'react';
import { Users, Home, IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, subValue, icon, color }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
      <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
    </div>
    <div>
      <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</span>
      {subValue && (
        <div style={{ fontSize: '0.875rem', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
          <TrendingUp size={14} style={{ marginRight: '0.25rem' }} /> {subValue}
        </div>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Platform Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to the admin control panel. Here is your high-level overview.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          title="Total Users" 
          value="1,245" 
          subValue="+12% vs last month"
          icon={<Users size={24} />} 
          color="#3B82F6" 
        />
        <StatCard 
          title="Active Listings" 
          value="432" 
          subValue="+8% vs last month"
          icon={<Home size={24} />} 
          color="#10B981" 
        />
        <StatCard 
          title="Total Revenue (Platform Fee)" 
          value="₹1.4L" 
          subValue="+22% vs last month"
          icon={<IndianRupee size={24} />} 
          color="#F59E0B" 
        />
        <StatCard 
          title="Funds in Escrow" 
          value="₹8.5L" 
          icon={<IndianRupee size={24} />} 
          color="#8B5CF6" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Escrow Transactions</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ paddingBottom: '1rem', fontWeight: '500' }}>Transaction ID</th>
                <th style={{ paddingBottom: '1rem', fontWeight: '500' }}>Amount</th>
                <th style={{ paddingBottom: '1rem', fontWeight: '500' }}>Platform Fee</th>
                <th style={{ paddingBottom: '1rem', fontWeight: '500' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>TXN-84920</td>
                <td style={{ padding: '1rem 0', fontWeight: '600' }}>₹5,000</td>
                <td style={{ padding: '1rem 0', color: 'var(--secondary-color)' }}>₹250</td>
                <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>HELD</span></td>
              </tr>
              <tr>
                <td style={{ padding: '1rem 0' }}>TXN-84919</td>
                <td style={{ padding: '1rem 0', fontWeight: '600' }}>₹8,000</td>
                <td style={{ padding: '1rem 0', color: 'var(--secondary-color)' }}>₹400</td>
                <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>RELEASED</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle color="#EF4444" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Action Required</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>ID Verification</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 hrs ago</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Suresh Kumar uploaded Aadhar for verification.</p>
              <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}>Review Documents</button>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>Payment Dispute</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 day ago</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Renter claims payment made, Owner denied.</p>
              <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem' }}>Resolve Dispute</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
