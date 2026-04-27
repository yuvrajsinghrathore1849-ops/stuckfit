import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card'
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 4000);
  };

  if (isSuccess) {
    return (
      <div className="container success-state">
        <CheckCircle size={64} color="var(--color-primary)" />
        <h2>Order Confirmed!</h2>
        <p>Thank you for shopping with Stuckfit. Your order will be shipped shortly.</p>
        <p className="redirect-note">Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-content">
        <div className="checkout-flow">
          {/* Progress Indicator */}
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>Shipping</div>
            <div className={`step-divider ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>Payment</div>
            <div className={`step-divider ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>Review</div>
          </div>

          <form onSubmit={step === 3 ? handlePlaceOrder : handleNext}>
            {step === 1 && (
              <div className="form-section fade-in">
                <h2>Shipping Information</h2>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>ZIP / Postal Code</label>
                    <input type="text" name="zip" required value={formData.zip} onChange={handleChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary submit-btn">Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-section fade-in">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} />
                    <span>Credit / Debit Card</span>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleChange} />
                    <span>UPI</span>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" required />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="text" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn btn-primary">Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section fade-in">
                <h2>Review Your Order</h2>
                <div className="review-details">
                  <div className="review-box">
                    <h3>Shipping To</h3>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.zip}</p>
                    <button type="button" className="edit-link" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className="review-box">
                    <h3>Payment Method</h3>
                    <p>{formData.paymentMethod.toUpperCase()}</p>
                    <button type="button" className="edit-link" onClick={() => setStep(2)}>Edit</button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary submit-btn">Confirm & Place Order</button>
              </div>
            )}
          </form>
        </div>

        <div className="checkout-summary">
          {/* Mock Summary to look complete */}
          <h3>Order Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span>Minimalist Cotton T-Shirt x 1</span>
              <span>₹2800.00</span>
            </div>
            <div className="summary-item">
              <span>Oversized Wool Blend Coat x 2</span>
              <span>₹31200.00</span>
            </div>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹34000.00</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>₹34000.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
