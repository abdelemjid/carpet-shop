import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    //
  };

  return (
    <div className="w-full bg-clip-padding backdrop-blur-lg bg-opacity-10 border-b border-gray-50/10">
      <div className="container mx-auto py-5">
        <div className="w-full flex justify-between items-center">
          {/* Website Logo */}
          <NavLink to="/" end>
            Carpet Shop
          </NavLink>

          {/* Nav Links */}
          <div className="flex items-center space-x-5">
            {/* Cart Link */}
            <NavLink
              to="/cart"
              end
              className="transition-all duration-200 ease-in-out hover:bg-gray-50/20 px-3 py-1 rounded-sm"
            >
              Cart
            </NavLink>
            {/* Register Link */}
            {!user && (
              <NavLink
                to="/register"
                end
                className="transition-all duration-200 ease-in-out hover:bg-gray-50/20 px-3 py-1 rounded-sm"
              >
                Register
              </NavLink>
            )}
            {/* Login Link  */}
            {!user && (
              <NavLink
                to="/login"
                end
                className="transition-all duration-200 ease-in-out hover:bg-gray-50/20 px-3 py-1 rounded-sm"
              >
                Login
              </NavLink>
            )}
            {/* Login Link  */}
            {user && (
              <button
                onClick={handleLogout}
                className="cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50/20 px-3 py-1 rounded-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
