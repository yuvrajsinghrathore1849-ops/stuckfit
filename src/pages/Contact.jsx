import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      // Point this to the new Stuckfit API backend
      await axios.post('http://localhost:5000/api/messages', formData);
      setStatus({ type: 'success', message: 'Thank you for reaching out! Your message has been sent successfully. We will get back to you shortly.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ type: 'error', message: 'There was an error sending your message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page container fade-in" style={{ padding: '4rem 1rem' }}>
      <div className="contact-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>Contact Us</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Have a question about an order, styling advice, or just want to say hello? 
          Fill out the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="contact-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div className="contact-info">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Customer Service Hours</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Monday - Friday</p>
            <p style={{ color: 'var(--color-text-muted)' }}>9:00 AM - 6:00 PM EST</p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>General Inquiries</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Email: support@stuckfit.com</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Phone: +1 (555) 123-4567</p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Headquarters</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>123 Fashion Street</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Design District, NY 10001</p>
          </div>
        </div>

        <div className="contact-form-container" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
          {status.message && (
            <div style={{ 
              padding: '1rem', 
              marginBottom: '1.5rem', 
              borderRadius: '6px',
              backgroundColor: status.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: status.type === 'success' ? '#065f46' : '#b91c1c',
              border: `1px solid ${status.type === 'success' ? '#34d399' : '#f87171'}`
            }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>
            
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'background-color 0.2s'
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
