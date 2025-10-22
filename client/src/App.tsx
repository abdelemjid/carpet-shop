import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./layout/Layout";
import ProductReview from "./pages/ProductReview";

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
      {/* Product Review */}
      <Route
        path="/product/:productId"
        element={
          <Layout>
            <ProductReview />
          </Layout>
        }
      />
      {/* Register Page */}
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />
      {/* Login Page */}
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      {/* Any other route path except the above will lead to the main page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
