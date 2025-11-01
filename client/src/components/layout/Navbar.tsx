import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "@/apiClient";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemsCount } = useCartContext();
  const { navToggled, setNavToggled } = useAppContext();

  const {
    mutate: handleLogout,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ["logout"],
    mutationFn: apiClient.logout,
  });

  useEffect(() => {
    if (isSuccess && !isError) logout();
  }, [isPending]);

  useEffect(() => {
    navToggled &&
      window.addEventListener("popstate", () => setNavToggled(false));
  }, [navToggled]);

  return (
    <div className="w-full border-b border-gray-900/20 dark:border-gray-50/20">
      <div className="container mx-auto py-5">
        <div className="flex w-full justify-between items-center">
          {/* Website Logo */}
          <NavLink
            to="/"
            end
            className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400"
          >
            Carpet Store
          </NavLink>

          {/* Nav Links for Large Screens */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Cart Link */}
            <NavLink
              to="/cart"
              end
              className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-1"
            >
              <div className="relative">
                <ShoppingCart />
                {!!getItemsCount() && (
                  <span className="absolute -top-2 -right-4 w-[20px] h-[20px] p-2 rounded-full bg-red-400 flex justify-center items-center text-white text-xs">
                    {getItemsCount() > 99 ? "99+" : getItemsCount()}
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

          {/* Menu Button */}
          <Menu
            size={20}
            className="md:hidden cursor-pointer transition-colors duration-150 hover:text-indigo-400"
            onClick={() => setNavToggled(!navToggled)}
          />

          {/* Nav Links for Mobiles and Tabs */}
          <div
            onClick={() => setNavToggled(false)}
            className={`${
              !navToggled && "hidden"
            } absolute top-0 right-0 h-full w-full z-20 md:hidden flex flex-col justify-center items-center gap-5 dark:bg-gray-900/10 bg-gray-50/10 backdrop-blur-md transition-discrete duration-200 ease-in-out`}
          >
            {/* Cart Link */}
            <NavLink
              to="/cart"
              end
              className="transition-colors duration-150 ease-in-out hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-1"
            >
              <div className="relative">
                <ShoppingCart />
                {!!getItemsCount() && (
                  <span className="absolute -top-2 -right-4 w-[20px] h-[20px] p-2 rounded-full bg-red-400 flex justify-center items-center text-white text-xs">
                    {getItemsCount() > 99 ? "99+" : getItemsCount()}
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

            {/* Close Menu Button */}
            <X
              size={25}
              className="absolute z-30 top-5 right-5 cursor-pointer text-red-500 transition-colors duration-150 hover:text-red-600"
              onClick={() => setNavToggled(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
