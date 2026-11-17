import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    api('/orders/my-orders')
      .then(setOrders)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section-wrap orders-page">
      <div className="page-title-row">
        <div><span className="eyebrow">Your NeevCraft orders</span><h1>Order <em>history.</em></h1></div>
        <Link to="/shop" className="text-link">Shop components <span>↗</span></Link>
      </div>
      {location.state?.placedOrder && <div className="success-banner"><span>◇</span><div><strong>Demo order created.</strong><small>This capstone storefront does not notify or place an order with NeevCraft.</small></div></div>}
      {error && <div className="inline-error" role="alert">{error}</div>}
      {loading ? <div className="loading-line">Finding your orders…</div> : orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div className="order-card-top">
                <div><span className="eyebrow">ORDER PLACED</span><strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
                <div><span className="eyebrow">ORDER TOTAL</span><strong>{formatPrice(order.totalAmount)}</strong></div>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
              </div>
              <div className="order-products">
                {order.items.map((item, index) => <div className="order-product" key={`${item.product}-${index}`}><span className="order-product-dot">✳</span><div><strong>{item.name}</strong><small>{item.quantity} × {formatPrice(item.priceSnapshot)}</small></div></div>)}
              </div>
              <div className="order-delivery"><span>Delivery contact</span><strong>{order.shippingAddress?.name || 'Your address'} · {order.shippingAddress?.city || ''}</strong><span className="order-payment">Demo COD</span></div>
            </article>
          ))}
        </div>
      ) : !error && (
        <div className="empty-cart"><span className="empty-cart-icon">⌁</span><h2>No orders here yet.</h2><p>Browse the NeevCraft demo catalogue to get started.</p><Link to="/shop" className="button button-dark">Explore components <span>↗</span></Link></div>
      )}
    </main>
  );
}
