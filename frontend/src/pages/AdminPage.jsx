import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;
const initialProduct = {
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  compareAtPrice: '',
  features: '',
  boxContents: '',
  stock: '',
  category: '',
};
const statuses = ['placed', 'shipped', 'delivered'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState({ categoryRevenue: [], topProducts: [], totalOrders: 0, totalRevenue: 0 });
  const [productForm, setProductForm] = useState(initialProduct);
  const [editingId, setEditingId] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    const result = await api('/products?limit=100&sort=newest');
    setProducts(result.products);
  }, []);

  const loadOrders = useCallback(async () => {
    setOrders(await api('/orders/all'));
  }, []);

  const loadReport = useCallback(async () => {
    setReport(await api('/orders/report'));
  }, []);

  const reloadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadProducts(), loadOrders(), loadReport()]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [loadOrders, loadProducts, loadReport]);

  useEffect(() => {
    reloadDashboard();
  }, [reloadDashboard]);

  const outOfStock = useMemo(() => products.filter((product) => product.stock === 0).length, [products]);

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      compareAtPrice: productForm.compareAtPrice === '' ? null : Number(productForm.compareAtPrice),
      stock: Number(productForm.stock),
    };
    try {
      if (editingId) {
        await api(`/products/${editingId}`, { method: 'PUT', body: payload });
        setNotice('Product details are all up to date.');
      } else {
        await api('/products', { method: 'POST', body: payload });
        setNotice('Product added to the NeevCraft catalogue.');
      }
      setProductForm(initialProduct);
      setEditingId('');
      await Promise.all([loadProducts(), loadReport()]);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl || '',
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
      features: (product.features || []).join('\n'),
      boxContents: (product.boxContents || []).join('\n'),
      stock: String(product.stock),
      category: product.category,
    });
    document.getElementById('product-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const cancelEditing = () => {
    setEditingId('');
    setProductForm(initialProduct);
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Remove "${product.name}" from the catalogue?`)) return;
    setError('');
    setNotice('');
    try {
      await api(`/products/${product._id}`, { method: 'DELETE' });
      setProducts((current) => current.filter((entry) => entry._id !== product._id));
      setNotice('Product removed from the catalogue.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateStatus = async (orderId, status) => {
    setError('');
    try {
      const updated = await api(`/orders/${orderId}/status`, { method: 'PATCH', body: { status } });
      setOrders((current) => current.map((order) => order._id === updated._id ? updated : order));
      setNotice('Order status updated.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="section-wrap admin-page">
      <div className="admin-welcome">
        <div><span className="eyebrow"><span className="eyebrow-dot" /> NEEVCRAFT STORE ADMIN</span><h1>Catalogue &amp;<br /><em>order desk.</em></h1><p>Manage demonstration products, orders and sales reports.</p></div>
        <span className="admin-spark">✳</span>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="Store management">
        {['overview', 'products', 'orders'].map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'is-active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}<span>{tab === 'products' ? products.length : tab === 'orders' ? orders.length : ''}</span></button>)}
      </div>
      {error && <div className="inline-error" role="alert">{error}</div>}
      {notice && <div className="success-banner compact-banner"><span>✳</span><strong>{notice}</strong><button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
      {loading ? <div className="loading-line">Getting the shop ready…</div> : (
        <>
          {activeTab === 'overview' && <Overview report={report} products={products} orders={orders} outOfStock={outOfStock} />}
          {activeTab === 'products' && (
            <section className="admin-products">
              <div className="admin-section-heading"><div><span className="eyebrow">NeevCraft demo catalogue</span><h2>Product <em>catalogue.</em></h2></div><span>{products.length} products</span></div>
              <div className="admin-product-layout">
                <form id="product-editor" className="admin-product-form" onSubmit={handleProductSubmit}>
                  <span className="eyebrow">{editingId ? 'Update catalogue details' : 'Add a catalogue item'}</span>
                  <h3>{editingId ? 'Edit product' : 'New product'}</h3>
                  <label>Product name<input required maxLength="120" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Product title" /></label>
                  <label>Description<textarea required maxLength="2000" rows="3" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="Product overview..." /></label>
                  <label>Image URL<input type="url" value={productForm.imageUrl} onChange={(event) => setProductForm({ ...productForm, imageUrl: event.target.value })} placeholder="https://..." /></label>
                  <div className="admin-fields-row">
                    <label>Price (₹)<input type="number" min="0" step="0.01" required value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="2499" /></label>
                    <label>Stock<input type="number" min="0" step="1" required value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} placeholder="12" /></label>
                  </div>
                  <label>Compare-at price (₹)<input type="number" min="0" step="0.01" value={productForm.compareAtPrice} onChange={(event) => setProductForm({ ...productForm, compareAtPrice: event.target.value })} placeholder="Optional" /></label>
                  <label>Category<input required maxLength="60" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} placeholder="Boards, STEM Learning Kits..." /></label>
                  <label>Features<textarea rows="3" value={productForm.features} onChange={(event) => setProductForm({ ...productForm, features: event.target.value })} placeholder="One feature per line" /></label>
                  <label>In the box<textarea rows="3" value={productForm.boxContents} onChange={(event) => setProductForm({ ...productForm, boxContents: event.target.value })} placeholder="One included item per line" /></label>
                  <button className="button button-dark form-action" type="submit">{editingId ? 'Save product details' : 'Add product'} <span>↗</span></button>
                  {editingId && <button className="cancel-edit" type="button" onClick={cancelEditing}>Cancel edit</button>}
                </form>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td><span className="table-product"><img src={product.imageUrl} alt="" /><span>{product.name}</span></span></td>
                          <td>{product.category}</td>
                          <td>{formatPrice(product.price)}</td>
                          <td><span className={product.stock ? 'stock-count' : 'stock-count is-empty'}>{product.stock}</span></td>
                          <td><div className="table-actions"><button type="button" onClick={() => editProduct(product)}>Edit</button><button type="button" onClick={() => deleteProduct(product)}>Remove</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <div className="table-empty">The NeevCraft catalogue is empty.</div>}
                </div>
              </div>
            </section>
          )}
          {activeTab === 'orders' && <OrdersTable orders={orders} onStatusChange={updateStatus} />}
        </>
      )}
    </main>
  );
}

function Overview({ report, products, orders, outOfStock }) {
  const categoryMaximum = Math.max(...report.categoryRevenue.map((item) => item.totalRevenue), 1);
  return (
    <section className="admin-overview">
      <div className="dashboard-stats">
        <div className="dashboard-stat stat-dark"><span>Recorded demo revenue</span><strong>{formatPrice(report.totalRevenue)}</strong><small>From sample storefront orders</small><span className="stat-decoration">↗</span></div>
        <div className="dashboard-stat"><span>Demo orders</span><strong>{report.totalOrders}</strong><small>{orders.filter((order) => order.status === 'placed').length} awaiting status update</small><span className="stat-decoration">⌁</span></div>
        <div className="dashboard-stat"><span>Catalogue products</span><strong>{products.length}</strong><small>{outOfStock ? `${outOfStock} demo items show no stock` : 'Seed stock is for demonstration'}</small><span className="stat-decoration">✳</span></div>
      </div>
      <div className="dashboard-grid">
        <section className="dashboard-panel category-report">
          <div className="panel-heading"><div><span className="eyebrow">What's moving</span><h3>Revenue by <em>category.</em></h3></div><span className="panel-icon">↗</span></div>
          {report.categoryRevenue.length ? report.categoryRevenue.map((category) => (
            <div className="bar-row" key={category._id}>
              <div><span>{category._id}</span><strong>{formatPrice(category.totalRevenue)}</strong></div>
              <span className="bar-track"><span style={{ width: `${Math.max((category.totalRevenue / categoryMaximum) * 100, 4)}%` }} /></span>
              <small>{category.unitsSold} {category.unitsSold === 1 ? 'item' : 'items'} sold</small>
            </div>
          )) : <p className="panel-empty">Sales will show up here once the first order is in.</p>}
        </section>
        <section className="dashboard-panel top-products-panel">
          <div className="panel-heading"><div><span className="eyebrow">The crowd favourites</span><h3>Top <em>five.</em></h3></div><span className="panel-icon">✳</span></div>
          {report.topProducts.length ? report.topProducts.map((product, index) => (
            <div className="top-product-row" key={product._id}>
              <span className="top-product-index">{String(index + 1).padStart(2, '0')}</span><strong>{product._id}</strong><span>{product.totalSold} sold</span><b>{formatPrice(product.revenue)}</b>
            </div>
          )) : <p className="panel-empty">The first customer favourite is yet to be picked.</p>}
        </section>
      </div>
    </section>
  );
}

function OrdersTable({ orders, onStatusChange }) {
  return (
    <section className="admin-orders">
      <div className="admin-section-heading"><div><span className="eyebrow">Good things in motion</span><h2>Order <em>desk.</em></h2></div><span>{orders.length} orders</span></div>
      {!orders.length ? <div className="state-card"><span className="state-icon">⌁</span><h3>No orders to pack yet</h3><p>They'll show up here as soon as something is on its way.</p></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table order-admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th>Total</th><th>Contents</th><th>Status</th></tr></thead>
            <tbody>{orders.map((order) => (
              <tr key={order._id}>
                <td><span className="order-id">#{order._id.slice(-7).toUpperCase()}</span></td>
                <td><span className="customer-cell"><strong>{order.user?.name || 'NeevCraft customer'}</strong><small>{order.user?.email}</small></span></td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                <td><select className="status-select" value={order.status} onChange={(event) => onStatusChange(order._id, event.target.value)} aria-label={`Update status for order ${order._id}`}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
