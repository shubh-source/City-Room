import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Splash from './pages/Splash';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OwnerLayout from './components/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';

import AddRoom from './pages/owner/AddRoom';
import ManageRooms from './pages/owner/ManageRooms';
import OwnerEnquiries from './pages/owner/OwnerEnquiries';

import RenterLayout from './components/RenterLayout';
import RenterHome from './pages/renter/Home';
import RoomDetails from './pages/renter/RoomDetails';
import RenterPayments from './pages/renter/RenterPayments';

import Profile from './pages/shared/Profile';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Owner Routes */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="enquiries" element={<OwnerEnquiries />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Renter Routes */}
          <Route path="/renter" element={<RenterLayout />}>
            <Route index element={<RenterHome />} />
            <Route path="room/:id" element={<RoomDetails />} />
            <Route path="payments" element={<RenterPayments />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
