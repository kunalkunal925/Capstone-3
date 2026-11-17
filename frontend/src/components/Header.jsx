import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COMPANY } from '../company';

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const signOut = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement">
        <span className="announcement-pulse" aria-hidden="true" />{COMPANY.delivery}
      </div>
      <header className="site-header">
        <div className="nav-shell">
          <button className="mobile-menu-button" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
          </button>
          <Link className="brand" to="/" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">N</span>
            <span className="brand-wordmark">Neev<span>Craft</span></span>
          </Link>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <NavLink to="/shop" onClick={closeMenu}>Components</NavLink>
            <NavLink to="/projects" onClick={closeMenu}>Engineering support</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink to="/faq" onClick={closeMenu}>FAQ</NavLink>
            {user && <NavLink to="/orders" onClick={closeMenu}>My orders</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
          </nav>
          <div className="nav-actions">
            {user ? (
              <div className="account-menu">
                <button className="account-button" onClick={() => setMenuOpen(!menuOpen)} type="button" aria-label="Account options">
                  <span className="avatar">{user.name?.slice(0, 1).toUpperCase()}</span>
                  <span className="account-name">{user.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <div className="account-popover">
                    <span className="popover-email">{user.email}</span>
                    <Link to="/orders" onClick={closeMenu}>Your orders</Link>
                    {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}>NeevCraft dashboard</Link>}
                    <button type="button" onClick={signOut}>Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="sign-in-link" to="/login">Sign in</Link>
            )}
            <Link className="bag-button" to={user ? '/cart' : '/login'} aria-label={`Shopping bag, ${itemCount} items`}>
              <BagIcon />
              <span className="bag-label">Bag</span>
              <span className="bag-count">{itemCount}</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
