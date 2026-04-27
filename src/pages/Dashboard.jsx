import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div>
              <h3>John Doe</h3>
              <p>john@example.com</p>
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
              <form className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="john@example.com" />
                </div>
                <button type="button" className="btn btn-primary">Update Profile</button>
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
