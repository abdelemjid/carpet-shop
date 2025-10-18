import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "@/apiClient";

const Navbar = () => {
  const [toggled, setToggled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const { mutate: handleLogout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await apiClient.logout();
      logout();
    },
  });

  const toggleMenu = () => {
    setToggled(!toggled);
  };

  return (
    <div className="w-full">
      <div className="container flex flex-row justify-between items-center py-5">
        {/* Navbar Logo */}
        <div className="text-lg font-bold">
          <NavLink
            to="/admin"
            className="py-2 transition-all duration-250 ease-in-out hover:text-indigo-400"
          >
            {isAuthenticated ? "Admin Dashboard" : "Administration"}
          </NavLink>
        </div>

        {/* Navbar Links */}
        {isAuthenticated && (
          <div className="transition-all duration-200 ease-in-out">
            {/* Large Screens Navbar */}
            <div className="hidden md:flex flex-row items-center gap-10">
              <NavLink
                to="/admin/products"
                className="py-2 rounded-sm transition-all duration-250 ease-in-out hover:text-indigo-400 active:text-indigo-400"
              >
                Products
              </NavLink>
              <NavLink
                to="/admin/orders"
                className="py-2 rounded-sm transition-all duration-250 ease-in-out hover:text-indigo-400  active:text-indigo-400"
              >
                Orders
              </NavLink>
              <NavLink
                to="/admin/users"
                className="py-2 rounded-sm transition-all duration-250 ease-in-out hover:text-indigo-400  active:text-indigo-400"
              >
                Users
              </NavLink>
              <button
                onClick={() => handleLogout()}
                className="cursor-pointer py-2 rounded-sm transition-all duration-250 ease-in-out hover:text-red-400"
              >
                Logout
              </button>
            </div>

            {/* Mobile and Tabs Screens Navbar */}
            {toggled && (
              <div className="absolute top-0 right-0 z-10 px-5 h-screen w-[350px] max-w-screen md:hidden flex flex-col gap-1 bg-gray-50/10 backdrop-blur-md text-center">
                <button
                  className="w-fit p-1 place-self-end text-red-400 my-5"
                  onClick={toggleMenu}
                >
                  <X />
                </button>
                <NavLink
                  to="/admin/products"
                  className="py-2 px-5 rounded-sm transition-all duration-250 ease-in-out hover:text-indigo-400  active:text-indigo-400"
                >
                  Products
                </NavLink>
                <NavLink
                  to="/admin/orders"
                  className="py-2 px-5 rounded-sm transition-all duration-250 ease-in-out hover:text-indigo-400  active:text-indigo-400"
                >
                  Orders
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className="py-2 px-5 rounded-sm transition-all duration-250 ease-in-out hover:text-indigo-400  active:text-indigo-400"
                >
                  Users
                </NavLink>
                <button
                  onClick={() => handleLogout()}
                  className="cursor-pointer py-2 px-5 rounded-sm transition-all duration-250 ease-in-out hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Burger Button */}
        {!toggled && (
          <button className="place-self-end md:hidden" onClick={toggleMenu}>
            <Menu />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
