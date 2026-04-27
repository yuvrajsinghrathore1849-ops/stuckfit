import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../mock/data';
import { ArrowRight, Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Product360View from '../components/Product360View';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [latestReply, setLatestReply] = useState(null);
  
  const { addToCart } = useCart();

  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
        
        // Fetch recent admin replies to show
        const msgResponse = await fetch('http://localhost:5000/api/messages');
        const msgs = await msgResponse.json();
        // Find the most recent message that has a reply
        const repliedMessages = msgs.filter(m => m.status === 'Replied' && m.reply);
        if (repliedMessages.length > 0) {
          // Sort by reply date if it exists, else use standard date
          setLatestReply(repliedMessages[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const trendingProducts = products.filter(p => p.isTrending);
  const productWith3D = products.find(p => p.model3d && p.model3d !== '');

  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; 
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    // Use default size/color or just pass as is
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    
    addToCart(product, 1, defaultSize, defaultColor);
    
    setToastMessage(`Added ${product.name} to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="home-page">
      {/* Latest Admin Reply Notification */}
      {latestReply && (
        <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '12px 20px', textAlign: 'center', fontSize: '0.95rem' }}>
          <strong>Support Update for {latestReply.name}:</strong> We replied to your message. 
          <span style={{ fontStyle: 'italic', opacity: 0.9, marginLeft: '5px' }}>"{latestReply.reply}"</span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="Fashion Hero" 
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">Elevate Your Everyday.</h1>
          <p className="hero-subtitle">Discover the new collection defined by minimalism, exceptional quality, and effortless style.</p>
          <div className="hero-actions">
            <Link to="/shop/category/new" className="btn btn-primary">Shop New Arrivals</Link>
            <Link to="/shop/category/women" className="btn btn-secondary">Explore Women's</Link>
          </div>
        </div>
      </section>

      {/* Categories / Feature Grids */}
      <section className="categories container">
        <div className="category-grid">
          <Link to="/shop/category/women" className="category-card">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" alt="Women" />
            <div className="category-content">
              <h2>Women</h2>
              <span>Shop Collection <ArrowRight size={16} /></span>
            </div>
          </Link>
          <Link to="/shop/category/men" className="category-card">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800" alt="Men" />
            <div className="category-content">
              <h2>Men</h2>
              <span>Shop Collection <ArrowRight size={16} /></span>
            </div>
          </Link>
          <Link to="/shop/category/accessories" className="category-card">
            <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800" alt="Accessories" />
            <div className="category-content">
              <h2>Accessories</h2>
              <span>Shop Collection <ArrowRight size={16} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending container">
        <div className="section-header">
          <h2>Trending Now</h2>
          <Link to="/shop" className="view-all">View All <ArrowRight size={16}/></Link>
        </div>
        {isLoading ? (
          <p className="text-center">Loading trending products...</p>
        ) : (
          <div className="product-slider-container">
            <button className="slider-btn prev" onClick={() => slide('left')} aria-label="Previous products">
              <ChevronLeft size={24} />
            </button>
            <div className="product-slider" ref={sliderRef}>
              {trendingProducts.map(product => (
                <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
                  <div className="product-image-container">
                    <img src={product.images[0]} alt={product.name} />
                    {product.isNew && <span className="badge">New</span>}
                    <button className="add-to-cart-quick" onClick={(e) => handleQuickAdd(e, product)}>
                      Quick Add
                    </button>
                  </div>
                  <div className="product-info">
                    <span className="product-brand">{product.brand}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-price">₹{Number(product.price).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <button className="slider-btn next" onClick={() => slide('right')} aria-label="Next products">
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>

      {/* 360 Product View */}
      <Product360View 
        title={productWith3D ? `Interactive 3D Showcase: ${productWith3D.name}` : "Interactive 3D Placeholder Showcase"}
        description={productWith3D ? "Drag to rotate and explore our newest arrival." : "Drag to rotate and zoom into details. Replace the placeholder cylinder with a real 3D product model."}
        modelUrl={productWith3D ? productWith3D.model3d : null}
      />

      {/* Customer Reviews */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header center">
            <h2>Loved by You</h2>
            <p>Don't just take our word for it.</p>
          </div>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div className="review-card" key={review.id}>
                <div className="stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <span className="author-name">{review.author}</span>
                  <span className="author-product">on {review.productInfo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Popup */}
      {showToast && (
        <div className="toast-popup fade-in" style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
          zIndex: 9999,
          fontWeight: '500'
        }}>
          <CheckCircle size={20} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Home;
