import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './RootLayout.css';

const RootLayout = () => {
  const { cartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="nav-left">
            <button className="mobile-menu-btn" aria-label="Menu" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>
            <Link to="/" className="logo-link">
              <img src="/logo.png" alt="Stuckfit Logo" className="logo-img" />
            </Link>
            <nav className="desktop-nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/shop/category/women" className="nav-link">Women</Link>
              <Link to="/shop/category/men" className="nav-link">Men</Link>
              <Link to="/shop/category/new" className="nav-link highlight">New Arrivals</Link>
            </nav>
          </div>
          
          <div className="nav-center">
            <Link to="/" className="text-logo">
              Stuckfit
            </Link>
          </div>

          <div className="nav-right">
            <button className="icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <Link to="/dashboard" className="icon-btn" aria-label="Account">
              <User size={20} />
            </Link>
            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Drawer */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>
      <nav className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" className="text-logo" onClick={closeMobileMenu}>Stuckfit</Link>
          <button className="icon-btn" onClick={closeMobileMenu}><X size={24} /></button>
        </div>
        <div className="mobile-nav-links">
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          <Link to="/shop/category/women" className="nav-link" onClick={closeMobileMenu}>Women</Link>
          <Link to="/shop/category/men" className="nav-link" onClick={closeMobileMenu}>Men</Link>
          <Link to="/shop/category/new" className="nav-link highlight" onClick={closeMobileMenu}>New Arrivals</Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="logo">
                <img src="/logo.png" alt="Stuckfit" className="logo-img footer-logo-img" />
              </Link>
              <p>Minimalist fashion for the modern aesthetic. Explore our carefully curated collections designed for everyday elegance.</p>
            </div>
            
            <div className="footer-links">
              <h3>Shop</h3>
              <ul>
                <li><Link to="/shop/category/women">Women's Collection</Link></li>
                <li><Link to="/shop/category/men">Men's Collection</Link></li>
                <li><Link to="/shop/category/kids">Kids' Collection</Link></li>
                <li><Link to="/shop/category/accessories">Accessories</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping & Returns</Link></li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Stuckfit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
