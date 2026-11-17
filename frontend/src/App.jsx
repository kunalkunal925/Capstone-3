import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import { LoginPage, RegisterPage } from './pages/AccountPages';
import { HomePage, ProductPage, ShopPage } from './pages/StorePages';
import OrdersPage from './pages/OrdersPage';
import { AboutPage, FaqPage, PoliciesPage, ProjectPage } from './pages/InformationPages';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span className="eyebrow">Looks like a wrong turn</span>
      <h1>Nothing to see here.</h1>
      <p>That page may have moved. Let’s get you back to the NeevCraft catalogue.</p>
      <Link to="/shop" className="button button-dark">Explore components <span>↗</span></Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
