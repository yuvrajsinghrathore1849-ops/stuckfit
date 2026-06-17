import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  // User Profile State
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    picture: null
  });

  const [editName, setEditName] = useState('John Doe');
  const [editEmail, setEditEmail] = useState('john@example.com');
  const [updateMessage, setUpdateMessage] = useState('');

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userAuth');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditName(parsedUser.name || '');
      setEditEmail(parsedUser.email || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth'); // Log out user session
    navigate('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }

    // Sync user details to backend API database
    try {
      await fetch(`${API_URL}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail })
      });
    } catch (err) {
      console.error('Failed to sync updated user profile to API:', err);
    }

    const updatedUser = {
      ...user,
      name: editName,
      email: editEmail
    };

    localStorage.setItem('userAuth', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setUpdateMessage('Profile updated successfully!');
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            {user.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <div className="avatar">{getInitials(user.name)}</div>
            )}
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <nav className="dashboard-nav">
            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <Package size={20} /> Orders
            </button>
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={20} /> Profile Details
            </button>
            <button className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
              <Heart size={20} /> Wishlist
            </button>
            <button className="nav-item logout" onClick={handleLogout}>
              <LogOut size={20} /> Log Out
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {activeTab === 'orders' && (
            <div className="tab-pane fade-in">
              <h2>Order History</h2>
              <div className="order-list">
                <div className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">Order #ORD-8492</span>
                      <span className="order-date">October 15, 2026</span>
                    </div>
                    <span className="order-status delivered">Delivered</span>
                  </div>
                  <div className="order-body">
                    <div className="order-item-list">
                      <p>1x Minimalist Cotton T-Shirt</p>
                    </div>
                    <div className="order-total">
                      Total: ₹50.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-pane fade-in">
              <h2>Profile Details</h2>
              {updateMessage && (
                <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  {updateMessage}
                </div>
              )}
              <form className="profile-form" onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)} 
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
              </form>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="tab-pane fade-in">
              <h2>Your Wishlist</h2>
              <p className="empty-state">Your wishlist is currently empty.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
