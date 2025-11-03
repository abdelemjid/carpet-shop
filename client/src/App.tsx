import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./layout/Layout";
import ProductPreview from "./pages/ProductPreview";
import Cart from "./pages/Cart";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Orders from "./pages/Orders";
import Products from "./pages/Products";

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
            <Products />
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
          <Layout>
            <Orders />
          </Layout>
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
      {/* Register Page */}
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Layout>
              <Register />
            </Layout>
          </PublicOnlyRoute>
        }
      />
      {/* Login Page */}
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
