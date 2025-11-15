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
import EditProduct from "./pages/EditProduct";
import UserOrders from "./pages/UserOrders";
import NewUserPage from "./pages/NewUserPage";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { ProductsContextProvider } from "./contexts/products/ProductsFilter";
import { HomeFilterContextProvider } from "./contexts/home/HomeFilterContext";
import { OrdersFilterContextProvider } from "./contexts/orders/OrdersFilterContext";
import { UsersFilterContextProvider } from "./contexts/user/UsersFilterContext";

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout>
              <HomeFilterContextProvider>
                <HomePage />
              </HomeFilterContextProvider>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Product Routes */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <Layout>
              <ImageViewProvider>
                <ProductsContextProvider>
                  <ProductsPage />
                </ProductsContextProvider>
              </ImageViewProvider>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute>
            <Layout>{<NewProduct />}</Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:productId"
        element={
          <ProtectedRoute>
            <Layout>{<EditProduct />}</Layout>
          </ProtectedRoute>
        }
      />

      {/* Order Routes */}
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <OrdersFilterContextProvider>
                <OrdersPage />
              </OrdersFilterContextProvider>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Layout>
              <UsersFilterContextProvider>
                <UsersPage />
              </UsersFilterContextProvider>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:userId"
        element={
          <ProtectedRoute>
            <Layout>{<UserOrders />}</Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute>
            <Layout>
              <NewUserPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route
        path="/admin/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* Catch-all: redirect unknown paths */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
