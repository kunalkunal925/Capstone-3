import { Link } from 'react-router-dom';
import { COMPANY } from '../company';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand brand-inverted" to="/">
            <span className="brand-mark" aria-hidden="true">N</span>
            <span className="brand-wordmark">Neev<span>Craft</span></span>
          </Link>
          <p>Components, robotics and practical engineering support — from the first idea to a working build.</p>
        </div>
        <div className="footer-links">
          <span className="footer-heading">Explore NeevCraft</span>
          <Link to="/shop">Components & kits</Link>
          <Link to="/projects">Build my project</Link>
          <Link to="/about">About the company</Link>
          <Link to="/faq">Frequently asked questions</Link>
          <Link to="/policies">Shipping & policies</Link>
        </div>
        <div className="footer-note">
          <span className="footer-heading">Talk to the team</span>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <a href={`tel:${COMPANY.phoneLink}`}>{COMPANY.phone}</a>
          <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer">WhatsApp project support ↗</a>
          <p>{COMPANY.address}</p>
          <div className="footer-socials">
            <a href={COMPANY.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={COMPANY.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NeevCraft. Engineering for makers.</span>
        <span>Capstone storefront · Verify live prices, stock and payment options with NeevCraft.</span>
      </div>
    </footer>
  );
}
