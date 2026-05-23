import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AppContextProvider } from './context/AppContext';

import Splash from './pages/Splash';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OwnerLayout from './components/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';

import AddRoom from './pages/owner/AddRoom';
import ManageRooms from './pages/owner/ManageRooms';
import OwnerEnquiries from './pages/owner/OwnerEnquiries';

import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Support from './pages/legal/Support';

import RenterLayout from './components/RenterLayout';
import RenterHome from './pages/renter/Home';
import RoomDetails from './pages/renter/RoomDetails';
import RenterPayments from './pages/renter/RenterPayments';
import Saved from './pages/renter/Saved';

import Profile from './pages/shared/Profile';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public / Legal Routes */}
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />
            
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
              <Route path="saved" element={<Saved />} />
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
    </AppContextProvider>
  );
}

export default App;

