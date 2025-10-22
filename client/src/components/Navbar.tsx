import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "@/apiClient";
import { ShoppingCart } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useAppContext();

  const {
    mutate: handleLogout,
    isSuccess,
    isPending,
  } = useMutation({
    mutationKey: ["logout"],
    mutationFn: apiClient.logout,
  });

  if (isSuccess) logout();

  return (
    <div className="w-full border-b border-gray-900/20 dark:border-gray-50/20">
      <div className="container mx-auto py-5">
        <div className="w-full flex justify-between items-center">
          {/* Website Logo */}
          <NavLink
            to="/"
            end
            className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400"
          >
            Carpet Store
          </NavLink>

          {/* Nav Links */}
          <div className="flex items-center space-x-5">
            {/* Cart Link */}
            <NavLink
              to="/cart"
              end
              className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-1"
            >
              <div className="relative">
                <ShoppingCart />
                {!!getItemCount() && (
                  <span className="absolute -top-2 -right-4 w-[20px] h-[20px] p-2 rounded-full bg-red-400 flex justify-center items-center text-white tex-xs">
                    {getItemCount()}
                  </span>
                )}
              </div>
            </NavLink>
            {/* Orders Link */}
            <NavLink
              to="/orders"
              end
              className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-1"
            >
              My Orders
            </NavLink>
            {/* Register Link */}
            {!user && (
              <NavLink
                to="/register"
                end
                className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-1"
              >
                Register
              </NavLink>
            )}
            {/* Login Link  */}
            {!user && (
              <NavLink
                to="/login"
                end
                className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-1"
              >
                Login
              </NavLink>
            )}
            {/* Login Link  */}
            {user && (
              <button
                onClick={() => handleLogout()}
                className="cursor-pointer transition-colors duration-150 ease-in-out hover:text-red-500 px-3 py-1 rounded-sm"
              >
                {isPending ? "Logging out" : "Logout"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
