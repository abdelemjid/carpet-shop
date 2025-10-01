import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UsersPage from "./pages/UsersPage";
import NewProduct from "./pages/NewProduct";
import { ImageViewProvider } from "./contexts/ImagePreviewContext";

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        index
        element={
          <ProtectedRoute>
            <Layout>{<HomePage />}</Layout>
          </ProtectedRoute>
        }
      />

      {/* Product Routes */}
      <Route
        path="products"
        element={
          <ProtectedRoute>
            <Layout>
              {<ImageViewProvider>{<ProductsPage />}</ImageViewProvider>}
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="products/new"
        element={
          <ProtectedRoute>
            <Layout>{<NewProduct />}</Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="products/:productId"
        element={
          <ProtectedRoute>
            <Layout>{<NewProduct />}</Layout>
          </ProtectedRoute>
        }
      />

      {/* Order Routes */}
      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <Layout>{<OrdersPage />}</Layout>
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="users"
        element={
          <ProtectedRoute>
            <Layout>{<UsersPage />}</Layout>
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Catch-all: redirect unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
