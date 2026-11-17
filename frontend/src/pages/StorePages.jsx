import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CATEGORIES, COMPANY, SERVICES } from '../company';

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;

const categoryImages = {
  'RoboDrive ESP32 Smart Car': '1788711582_Esp32002.jpeg',
  Boards: '1788713059_product_6fb45ab0bb4d.png',
  'RoboDrive Arduino Smart Car': '1788712917_product_6830d8562d9c.png',
  'STEM Learning Kits': '1788714498_product_11da240262a9.png',
  'Arduino Project': '1788716242_product_9315b856cfc4.jpeg',
  Earbuds: '1791811290_product_b266283568a4.png',
};

function ProductGrid({ products, loading, error, emptyTitle = 'No products to show yet' }) {
  if (loading) {
    return <div className="product-grid">{[1, 2, 3, 4].map((item) => <div className="skeleton-card" key={item} />)}</div>;
  }
  if (error) return <div className="state-card"><span className="state-icon">!</span><h3>We couldn't load the catalogue</h3><p>{error}</p></div>;
  if (!products.length) return <div className="state-card"><span className="state-icon">⌁</span><h3>{emptyTitle}</h3><p>Try changing your filters or contact NeevCraft for help finding a part.</p></div>;
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div>;
}

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api('/products?limit=8&sort=newest')
      .then((result) => setProducts(result.products))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="hero-section neev-hero">
        <div className="hero-copy">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> HARDWARE · ROBOTICS · SOFTWARE</span>
          <h1>Make your<br />next idea <em>real.</em></h1>
          <p>Find electronics and robotics kits, or work with an engineering team to turn a concept into a tested prototype.</p>
          <div className="hero-actions">
            <Link to="/shop" className="button button-white">Explore components <span>↗</span></Link>
            <Link to="/projects" className="hero-secondary-link">Build my project <span>↗</span></Link>
          </div>
          <div className="hero-stats">
            <div><strong>4</strong><span>Core disciplines</span></div>
            <div><strong>360°</strong><span>Hardware to software</span></div>
            <div><strong>24h*</strong><span>Initial review target</span></div>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://neevcraft.com/uploads/1788711582_Esp32002.jpeg"
            alt="NeevCraft ESP32 four-wheel-drive smart robot car kit"
          />
          <div className="hero-image-label"><span>BUILT FOR MAKERS</span><strong>From the first wire<br />to a working build.</strong></div>
          <span className="hero-image-index">ROBOTICS / IOT</span>
        </div>
        <span className="hero-deco" aria-hidden="true">⌁</span>
      </section>

      <section className="trust-strip" aria-label="NeevCraft capabilities">
        <span><i>⌁</i> Electronics & robotics kits</span>
        <span><i>↗</i> Pan-India component delivery</span>
        <span><i>◇</i> Concept-to-prototype support</span>
        <span><i>✳</i> Built for makers and learners</span>
      </section>

      <section className="section-wrap category-section">
        <div className="section-heading">
          <div><span className="eyebrow">Parts for your next build</span><h2>Explore the <em>catalogue.</em></h2></div>
          <Link to="/shop" className="text-link">View all components <span>↗</span></Link>
        </div>
        <div className="category-grid category-grid-neev">
          {CATEGORIES.map((category, index) => (
            <button
              type="button"
              className={`category-card category-card-${index + 1}`}
              key={category}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(category)}`)}
            >
              <img src={`https://neevcraft.com/uploads/${categoryImages[category]}`} alt="" loading="lazy" />
              <span className="category-overlay" />
              <span className="category-card-copy"><small>NEEVCRAFT / {String(index + 1).padStart(2, '0')}</small><strong>{category}</strong></span>
              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-wrap featured-section">
        <div className="section-heading">
          <div><span className="eyebrow">Boards, kits and maker essentials</span><h2>Featured <em>products.</em></h2></div>
          <Link to="/shop" className="text-link">Shop all products <span>↗</span></Link>
        </div>
        <ProductGrid products={products} loading={loading} error={error} />
        <p className="catalogue-disclaimer">Product prices and availability can change. Please confirm current details with NeevCraft before ordering.</p>
      </section>

      <section className="engineering-section" id="capabilities">
        <div className="section-wrap engineering-inner">
          <div className="engineering-intro">
            <span className="eyebrow"><span className="eyebrow-dot" /> ENGINEERING SUPPORT</span>
            <h2>One team for<br /><em>the whole build.</em></h2>
            <p>Hardware, firmware and software work best when they are planned together. NeevCraft supports students, makers, educators and early-stage teams from a clear brief to a documented prototype.</p>
            <Link to="/projects" className="button button-dark">Share your project brief <span>↗</span></Link>
          </div>
          <div className="service-grid">
            {SERVICES.map((service) => (
              <article className="service-card" key={service.title}>
                <span>{service.mark}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section section-wrap">
        <div className="section-heading">
          <div><span className="eyebrow">A clear path from idea to handover</span><h2>How project support <em>works.</em></h2></div>
          <Link to="/about" className="text-link">More about NeevCraft <span>↗</span></Link>
        </div>
        <div className="process-grid">
          {[
            ['01', 'Concept & schematic', 'Share the brief, target features or a rough diagram.'],
            ['02', 'Review & quote', 'Discuss feasibility, scope, cost and a practical timeline.'],
            ['03', 'Fabrication & coding', 'Integrate hardware, firmware and software, then test real behavior.'],
            ['04', 'Delivery & documentation', 'Agree the handover, setup notes, code and project walkthrough.'],
          ].map(([step, title, copy]) => (
            <article className="process-card" key={step}>
              <span>{step}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-cta">
        <div className="company-cta-mark" aria-hidden="true">N<span>✳</span></div>
        <span className="eyebrow">HAVE AN IDEA? START WITH A BRIEF.</span>
        <h2>Let’s make something<br /><em>that works.</em></h2>
        <p>Tell NeevCraft what you want to build. The team targets an initial project review within 24 hours of receiving a complete brief.</p>
        <Link to="/projects" className="button button-white">Build my project <span>↗</span></Link>
        <small>*Initial review timing is a target, not a guaranteed response time.</small>
      </section>
    </main>
  );
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState({ products: [], total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const query = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api(`/products?${query}`)
      .then((data) => { if (active) setResult(data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const changePage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', nextPage);
    setSearchParams(next);
  };

  return (
    <main className="shop-page section-wrap">
      <div className="shop-page-heading">
        <div>
          <span className="eyebrow">Components, boards and learning kits</span>
          <h1>Shop <em>NeevCraft.</em></h1>
          <p>Find a part for your next electronics, robotics or STEM project.</p>
        </div>
        <span className="result-count">{result.total} products</span>
      </div>
      <div className="shop-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search products..." aria-label="Search products" />
          {search && <button type="button" onClick={() => updateFilter('search', '')} aria-label="Clear search">×</button>}
        </label>
        <label className="filter-select">
          <span className="sr-only">Category</span>
          <select value={category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-select sort-select">
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="newest">Recently added</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </label>
        <div className="price-filters">
          <label><span>₹</span><input type="number" min="0" placeholder="Min" value={minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} /></label>
          <span>–</span>
          <label><span>₹</span><input type="number" min="0" placeholder="Max" value={maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} /></label>
        </div>
      </div>
      <ProductGrid products={result.products} loading={loading} error={error} emptyTitle="No products match these filters" />
      {result.totalPages > 1 && (
        <div className="pagination">
          <button type="button" className="pagination-button" disabled={page <= 1} onClick={() => changePage(page - 1)}>← Previous</button>
          <span>Page <strong>{result.page}</strong> of {result.totalPages}</span>
          <button type="button" className="pagination-button" disabled={page >= result.totalPages} onClick={() => changePage(page + 1)}>Next →</button>
        </div>
      )}
      <p className="catalogue-disclaimer">Prices and stock are demonstration catalogue data and may not reflect live availability. Confirm with NeevCraft before ordering.</p>
    </main>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setError('');
    setProduct(null);
    api(`/products/${id}`)
      .then(setProduct)
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  const handleAdd = async () => {
    if (!user) return navigate('/login', { state: { message: 'Sign in to add this product to your bag.' } });
    try {
      await addItem(product._id);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (error && !product) return <main className="section-wrap"><div className="state-card"><h3>We couldn't find that product</h3><p>{error}</p><Link to="/shop" className="text-link">Back to components ↗</Link></div></main>;
  if (!product) return <main className="section-wrap"><div className="loading-line">Loading product details…</div></main>;

  const hasDiscount = Number(product.compareAtPrice) > Number(product.price);
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <main className="section-wrap product-detail-page">
      <Link to="/shop" className="back-link">← Back to components</Link>
      <div className="product-detail">
        <div className="detail-image-wrap"><img src={product.imageUrl} alt={product.name} /></div>
        <div className="detail-copy">
          <span className="eyebrow">{product.category} · NEEVCRAFT</span>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(product.price)}</span>
            {hasDiscount && <><del>{formatPrice(product.compareAtPrice)}</del><span className="discount-tag">{discount}% off</span></>}
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-stock">{product.stock > 0 ? <><span className="stock-dot" /> Demo catalogue shows this item as available</> : 'Currently unavailable in this demo catalogue'}</div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark detail-add" type="button" onClick={handleAdd} disabled={product.stock <= 0}>
            {added ? 'Added to your bag ✓' : 'Add to bag'} <span>{added ? '' : '↗'}</span>
          </button>
          <div className="detail-perks">
            <span>↗ {COMPANY.delivery}</span>
            <span>⌁ Project wiring and technical support may be available; ask the team.</span>
            <span>COD checkout is a demonstration flow only; no online payment is processed.</span>
          </div>
        </div>
      </div>
      {(product.features?.length > 0 || product.boxContents?.length > 0) && (
        <div className="product-spec-grid">
          {product.features?.length > 0 && (
            <section className="product-spec-panel">
              <span className="eyebrow">Product details</span><h2>Features & <em>specifications.</em></h2>
              <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </section>
          )}
          {product.boxContents?.length > 0 && (
            <section className="product-spec-panel">
              <span className="eyebrow">Package contents</span><h2>What’s in the <em>box.</em></h2>
              <ul>{product.boxContents.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
