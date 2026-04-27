import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { reviews } from '../mock/data';
import { Star, Truck, RefreshCcw, ShieldCheck, ChevronRight, CheckCircle } from 'lucide-react';
import Product360View from '../components/Product360View';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        // Fetch the single product
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) {
          navigate('/shop');
          return;
        }
        const foundProduct = await res.json();
        
        setProduct(foundProduct);
        setSelectedSize('');
        setSelectedColor(foundProduct.colors[0]);
        setActiveImage(foundProduct.images[0]);
        
        // Fetch all products to filter related ones
        const allRes = await fetch('http://192.168.31.53:5000/api/products');
        const allProducts = await allRes.json();
        const related = allProducts
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
          
        setRelatedProducts(related);
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching product data:', error);
        navigate('/shop');
      }
    };

    fetchProductData();
  }, [id, navigate]);

  if (isLoading || !product) return <div className="loading-state">Loading product details...</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="product-page">
      {/* Breadcrumbs */}
      <div className="container breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/shop/category/${product.category}`}>{product.category}</Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </div>

      <div className="container product-main">
        {/* Images */}
        <div className="product-gallery">
          <div className="gallery-thumbnails">
            {/* Using the same image duplicated to simulate gallery for demo */}
            {[product.images[0], product.images[0], product.images[0]].map((img, idx) => (
              <button 
                key={idx} 
                className={`thumbnail-btn ${activeImage === img && idx === 0 ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`Thumbnail ${idx+1}`} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <img src={activeImage} alt={product.name} />
          </div>
        </div>

        {/* Info */}
        <div className="product-details">
          <span className="product-brand">{product.brand}</span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <h2 className="product-price">₹{product.price.toFixed(2)}</h2>
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className={i < Math.floor(product.rating) ? "filled" : "empty"}
                  />
                ))}
              </div>
              <span className="review-count">({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-options">
            {/* Colors */}
            <div className="option-group">
              <div className="option-header">
                <h3>Color:</h3>
                <span>{selectedColor}</span>
              </div>
              <div className="color-options">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                    title={color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="option-group">
              <div className="option-header">
                <h3>Size</h3>
                <button className="size-guide">Size Guide</button>
              </div>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-selector ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="option-group quantity-group">
              <h3>Quantity</h3>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <button className="btn btn-primary add-to-cart-main" onClick={handleAddToCart}>
              Add to Cart - ₹{(product.price * quantity).toFixed(2)}
            </button>
          </div>

          <div className="product-perks">
            <div className="perk">
              <Truck size={20} />
              <span>Free shipping on orders over ₹1500</span>
            </div>
            <div className="perk">
              <RefreshCcw size={20} />
              <span>Free 30-day returns</span>
            </div>
            <div className="perk">
              <ShieldCheck size={20} />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* 360 View - Only render if product has a model3d */}
      {product.model3d && (
        <Product360View 
          title={`${product.name} 3D View`}
          description="Drag to rotate and explore this product in 3D."
          modelUrl={product.model3d}
        />
      )}

      {/* Toast Popup */}
      {showToast && (
        <div className="toast-popup fade-in">
          <CheckCircle size={20} />
          <span>Added to cart!</span>
          <Link to="/cart" className="toast-link">View Cart</Link>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products container">
          <div className="section-header">
            <h2>You May Also Like</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map(rp => (
              <Link to={`/product/${rp.id}`} className="product-card" key={rp.id}>
                <div className="product-image-container">
                  <img src={rp.images[0]} alt={rp.name} />
                  {rp.isNew && <span className="badge">New</span>}
                </div>
                <div className="product-info">
                  <span className="product-brand">{rp.brand}</span>
                  <h3 className="product-name">{rp.name}</h3>
                  <span className="product-price">₹{rp.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Product;
