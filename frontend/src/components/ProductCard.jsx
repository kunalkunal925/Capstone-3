import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

export default function ProductCard({ product, index = 0 }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const hasDiscount = Number(product.compareAtPrice) > Number(product.price);
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const handleAdd = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Sign in to add something to your bag.' } });
      return;
    }
    try {
      setError('');
      await addItem(product._id);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <article className="product-card" style={{ '--card-index': index }}>
      <Link to={`/product/${product._id}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
        <img
          src={product.imageUrl || 'https://www.neevcraft.com/NeevCraft.png'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
        />
        <span className="product-category">{product.category}</span>
        {hasDiscount && <span className="sale-badge">{discount}% off</span>}
        {product.stock <= 0 && <span className={`sold-out-tag${hasDiscount ? ' sold-out-tag-sale' : ''}`}>Sold out</span>}
        <button className="quick-add" type="button" onClick={(event) => { event.preventDefault(); handleAdd(); }} disabled={product.stock <= 0}>
          <span>{product.stock <= 0 ? 'Unavailable' : added ? 'Added ✓' : 'Add to bag'}</span>
          <span aria-hidden="true">{added ? '' : '+'}</span>
        </button>
      </Link>
      <div className="product-info">
        <div>
          <Link to={`/product/${product._id}`} className="product-name">{product.name}</Link>
          <p className="product-description">{product.description}</p>
        </div>
        <div className="product-pricing">
          <span className="product-price">{formatPrice(product.price)}</span>
          {hasDiscount && <del className="product-compare-price">{formatPrice(product.compareAtPrice)}</del>}
        </div>
      </div>
      {error && <span className="card-message" role="alert">{error}</span>}
    </article>
  );
}
