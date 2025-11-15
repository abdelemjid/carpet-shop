import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Layout from "./layout/Layout";
import ProductPreview from "./pages/ProductPreviewPage";
import Cart from "./pages/CartPage";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Orders from "./pages/OrdersPage";
import Products from "./pages/ProductsPage";
import { SearchFilterProvider } from "./contexts/SearchAndFiltersContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      {/* Products Page */}
      <Route
        path="/products"
        element={
          <Layout>
            <SearchFilterProvider>
              <Products />
            </SearchFilterProvider>
          </Layout>
        }
      />
      {/* Product Review */}
      <Route
        path="/products/:productId"
        element={
          <Layout>
            <ProductPreview />
          </Layout>
        }
      />
      {/* Orders Page */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Checkout Page */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Layout>
              <CheckoutPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Cart Page */}
      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />
      {/* Login & Register Page */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Layout>
              <Login />
            </Layout>
          </PublicOnlyRoute>
        }
      />
      {/* Any other route path except the above will lead to the main page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
