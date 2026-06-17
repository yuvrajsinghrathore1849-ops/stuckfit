import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { products as mockProducts } from '../mock/data';
import './Shop.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortOption, setSortOption] = useState('newest');
  
  // Sync search query from URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Filter states
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceLimit, setPriceLimit] = useState(20000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic filter limits
  const maxPriceValue = useMemo(() => {
    const validPrices = products
      .map(p => Number(p.price))
      .filter(val => !isNaN(val) && val > 0);
    
    if (validPrices.length === 0) return 20000;
    return Math.ceil(Math.max(...validPrices));
  }, [products]);

  // Set default price limit when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const validPrices = products
        .map(p => Number(p.price))
        .filter(val => !isNaN(val) && val > 0);
      
      if (validPrices.length > 0) {
        const maxPrice = Math.ceil(Math.max(...validPrices));
        setPriceLimit(maxPrice);
      } else {
        setPriceLimit(20000);
      }
    }
  }, [products]);

  // Scroll to top and reset search/filters when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSearchQuery('');
    setSearchParams({});
    setSelectedSizes([]);
    setSelectedColors([]);
    setIsMobileFilterOpen(false);
  }, [category]);

  // Fetch products from backend with fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to local mock data if the API server is down
        setProducts(mockProducts);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Categories list
  const categoriesList = ['all', 'men', 'women', 'kids', 'accessories', 'new'];

  // Extract unique sizes dynamically
  const uniqueSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach(p => {
      if (p.sizes) {
        p.sizes.forEach(s => sizes.add(s));
      }
    });
    // Define a natural sorting order for sizes
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'OS', '2Y', '4Y', '6Y', '8Y'];
    return Array.from(sizes).sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [products]);

  // Extract unique colors dynamically
  const uniqueColors = useMemo(() => {
    const colors = new Set();
    products.forEach(p => {
      if (p.colors) {
        p.colors.forEach(c => colors.add(c));
      }
    });
    return Array.from(colors).sort();
  }, [products]);

  // Handle toggles
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceLimit(maxPriceValue);
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Route-based Category Filter
    if (category && category !== 'all' && category !== 'new') {
      result = result.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    } else if (category === 'new') {
      result = result.filter(p => p.isNew);
    }

    // 2. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) || 
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // 3. Sizes Filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    // 4. Colors Filter
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors && p.colors.some(c => selectedColors.includes(c)));
    }

    // 5. Price Limit Filter
    const limit = (typeof priceLimit === 'number' && !isNaN(priceLimit)) ? priceLimit : maxPriceValue;
    result = result.filter(p => {
      const price = Number(p.price);
      return !isNaN(price) && price <= limit;
    });

    // 6. Sorting (Immutable copy)
    let sortedResult = [...result];
    switch(sortOption) {
      case 'price-low':
        sortedResult.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResult.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        sortedResult.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
      default:
        sortedResult.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
        break;
    }

    return sortedResult;
  }, [category, searchQuery, selectedSizes, selectedColors, priceLimit, sortOption, products]);

  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || priceLimit < maxPriceValue || searchQuery;

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
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              if (value) {
                setSearchParams({ q: value });
              } else {
                setSearchParams({});
              }
            }}
          />
        </div>

        <div className="toolbar-actions">
          <button 
            className="mobile-filter-btn" 
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={16} /> Filters
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
        {/* Sidebar Panel for Filters */}
        <aside className={`shop-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-header-mobile">
            <h3>Filters</h3>
            <button className="close-sidebar-btn" onClick={() => setIsMobileFilterOpen(false)}>×</button>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="category-list">
              {categoriesList.map(cat => {
                const isActive = (!category && cat === 'all') || category === cat;
                return (
                  <Link 
                    key={cat} 
                    to={cat === 'all' ? '/shop' : `/shop/category/${cat}`}
                    className={`category-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    {cat === 'all' ? 'All Products' : cat === 'new' ? 'New Arrivals' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          {uniqueSizes.length > 0 && (
            <div className="filter-group">
              <h3>Filter by Size</h3>
              <div className="size-grid">
                {uniqueSizes.map(size => {
                  const isActive = selectedSizes.includes(size);
                  return (
                    <button 
                      key={size}
                      className={`size-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {uniqueColors.length > 0 && (
            <div className="filter-group">
              <h3>Filter by Color</h3>
              <div className="filter-options">
                {uniqueColors.map(color => {
                  const isActive = selectedColors.includes(color);
                  return (
                    <label key={color} className="color-checkbox">
                      <input 
                        type="checkbox" 
                        checked={isActive}
                        onChange={() => handleColorToggle(color)}
                      />
                      <span>{color}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price range */}
          <div className="filter-group">
            <h3>Max Price</h3>
            <div className="price-slider-container">
              <input 
                type="range" 
                min="0" 
                max={maxPriceValue} 
                value={priceLimit} 
                onChange={(e) => setPriceLimit(Number(e.target.value))} 
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>₹0</span>
                <span>₹{priceLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="sidebar-actions">
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={handleClearFilters}>
                Clear All
              </button>
            )}
            <button className="mobile-apply-btn btn btn-primary" onClick={() => setIsMobileFilterOpen(false)}>
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
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
                    <span className="product-price">₹{Number(product.price).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No products found matching your criteria.</p>
              <button 
                className="btn btn-secondary" 
                style={{borderColor: "var(--color-primary)", color: "var(--color-primary)"}} 
                onClick={handleClearFilters}
              >
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

