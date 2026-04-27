import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import './Shop.css';

const Shop = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2Y', '4Y', '6Y', '8Y', 'OS'];
  const availableColors = ['Black', 'White', 'Beige', 'Navy', 'Grey', 'Off-White', 'Blue Wash', 'Black Wash', 'Olive', 'Camel', 'Tan'];

  // Scroll to top and reset filters when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSearchQuery('');
    setSelectedSizes([]);
    setSelectedColors([]);
  }, [category]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category && category !== 'all' && category !== 'new') {
      result = result.filter(p => p.category === category);
    } else if (category === 'new') {
      result = result.filter(p => p.isNew);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(color => selectedColors.includes(color)));
    }

    switch(sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
        break;
    }

    return result;
  }, [category, searchQuery, sortOption, selectedSizes, selectedColors]);

  return (
    <div className="shop-page container">
      <div className="shop-header">
        <h1 className="shop-title">
          {category === 'new' ? 'New Arrivals' : category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection` : 'All Products'}
        </h1>
        <p className="shop-count">{isLoading ? 'Loading...' : `${filteredProducts.length} Results`}</p>
      </div>

      <div className="shop-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
            <Filter size={18} /> Filter
          </button>
          
          <div className="sort-dropdown">
            <span>Sort by:</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="shop-content">
        <aside className={`shop-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <h3>Size</h3>
            <div className="filter-options size-grid">
              {availableSizes.map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Color</h3>
            <div className="filter-options">
              {availableColors.map(color => (
                <label key={color} className="color-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleColor(color)}
                  />
                  <span>{color}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="shop-products">
          {isLoading ? (
            <div className="no-results"><p>Loading products from server...</p></div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
                  <div className="product-image-container">
                    <img src={product.images[0]} alt={product.name} />
                    {product.isNew && <span className="badge">New</span>}
                  </div>
                  <div className="product-info">
                    <span className="product-brand">{product.brand}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-price">₹{product.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No products found matching your criteria.</p>
              <button className="btn btn-secondary" style={{borderColor: "var(--color-primary)", color: "var(--color-primary)"}} onClick={() => {
                setSearchQuery('');
                setSelectedSizes([]);
                setSelectedColors([]);
              }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
