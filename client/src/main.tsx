import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "./contexts/AppContext.tsx";
import { CartContextProvider } from "./contexts/CartContext.tsx";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <AppContextProvider>
      <AuthProvider>
        <CartContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartContextProvider>
      </AuthProvider>
    </AppContextProvider>
  </QueryClientProvider>
);
