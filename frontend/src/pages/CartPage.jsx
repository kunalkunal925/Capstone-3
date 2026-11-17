import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;
const initialAddress = { name: '', phone: '', line1: '', city: '', postalCode: '' };

export default function CartPage() {
  const { cart, setQuantity, removeItem, clearCart, error: cartError } = useCart();
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const items = cart.items.filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const updateQuantity = async (productId, quantity) => {
    try {
      setError('');
      await setQuantity(productId, quantity);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteItem = async (productId) => {
    try {
      setError('');
      await removeItem(productId);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const order = await api('/orders', { method: 'POST', body: { shippingAddress: address } });
      clearCart();
      navigate('/orders', { replace: true, state: { placedOrder: order._id } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="section-wrap cart-page">
      <div className="page-title-row">
        <div><span className="eyebrow">NeevCraft components</span><h1>Your <em>bag.</em></h1></div>
        <span className="result-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>
      {(error || cartError) && <div className="inline-error" role="alert">{error || cartError}</div>}
      {items.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-icon">✳</span>
          <h2>Your build starts with a part.</h2>
          <p>Browse robotics kits, boards and electronics for your next project.</p>
          <Link to="/shop" className="button button-dark">Explore components <span>↗</span></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Items in your shopping bag">
            {items.map((item) => (
              <article className="cart-item" key={item.product._id}>
                <Link to={`/product/${item.product._id}`} className="cart-item-image"><img src={item.product.imageUrl} alt={item.product.name} /></Link>
                <div className="cart-item-info">
                  <span className="eyebrow">{item.product.category}</span>
                  <Link to={`/product/${item.product._id}`} className="cart-item-name">{item.product.name}</Link>
                  <span className="cart-item-price">{formatPrice(item.product.price)}</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => item.quantity > 1 ? updateQuantity(item.product._id, item.quantity - 1) : deleteItem(item.product._id)} aria-label="Decrease quantity">−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.product._id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div className="cart-item-end">
                  <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                  <button type="button" className="remove-link" onClick={() => deleteItem(item.product._id)}>Remove</button>
                </div>
              </article>
            ))}
            <Link to="/shop" className="continue-shopping">← Keep exploring components</Link>
          </section>
          <aside className="checkout-card">
            <div className="checkout-heading"><span className="eyebrow">Order preview</span><h2>Order <em>summary.</em></h2></div>
            <div className="summary-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-line"><span>Delivery estimate</span><span>3–5 business days*</span></div>
            <div className="summary-total"><span>Demo order total</span><strong>{formatPrice(subtotal)}</strong></div>
            <p className="checkout-disclaimer">Courier charges are not calculated here. Confirm final availability and shipping cost with NeevCraft.</p>
            <form className="checkout-form" onSubmit={handleCheckout}>
              <span className="checkout-subhead">Delivery contact details</span>
              <label>Full name<input required autoComplete="name" maxLength="80" value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} placeholder="Your name" /></label>
              <label>Phone number<input required type="tel" autoComplete="tel" maxLength="24" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} placeholder="+91 98765 43210" /></label>
              <label>Address<input required autoComplete="street-address" maxLength="120" value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} placeholder="House, street, area" /></label>
              <div className="address-row">
                <label>City<input required autoComplete="address-level2" maxLength="80" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} placeholder="City" /></label>
                <label>PIN code<input required autoComplete="postal-code" maxLength="16" value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} placeholder="PIN code" /></label>
              </div>
              <div className="payment-note"><span>◇</span><span><strong>Demonstration cash on delivery</strong><small>This capstone flow records an example order; it does not process a payment.</small></span></div>
              <button className="button button-dark checkout-button" type="submit" disabled={submitting}>{submitting ? 'Creating demo order…' : 'Place demo order'} <span>↗</span></button>
            </form>
            <p className="secure-note">*Typical in-stock delivery time listed by NeevCraft; confirm live timing before ordering.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
