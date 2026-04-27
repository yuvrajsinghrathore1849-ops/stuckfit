import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          
          {cartItems.map(item => (
            <div className="cart-item" key={item.cartId}>
              <div className="item-info">
                <img src={item.images[0]} alt={item.name} />
                <div className="item-details">
                  <span className="item-brand">{item.brand}</span>
                  <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                  <span className="item-variant">{item.selectedColor} / {item.selectedSize}</span>
                  <span className="item-price-mobile">₹{item.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="item-quantity">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>-</button>
                  <input type="number" value={item.quantity} readOnly />
                  <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
