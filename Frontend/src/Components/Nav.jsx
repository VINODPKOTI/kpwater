import React, { useState,useEffect } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage for a userID or token
    const userID = localStorage.getItem("userID");
    if (userID) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  

  // Function to close the menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navbar starts here */}
      <nav
        className="bg-gradient-to-r from-blue-600 to-emerald-600 border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full z-50"
        id="Home"
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-8 rounded" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-gray-100">
              KP Water Suppliers
            </span>
          </a>
          <div className="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse">


            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Main Menu */}
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isMenuOpen ? "block" : "hidden"
            }`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:flex-row md:mt-0 md:space-x-4">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                  aria-current="page"
                  onClick={closeMenu} // Close menu on click
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                  onClick={closeMenu} // Close menu on click
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                  onClick={closeMenu} // Close menu on click
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                  onClick={closeMenu} // Close menu on click
                >
                  {/* Image for the cart icon */}
                  <img
                    src={require("../assets/cart_icon_2.png")} // Path to your cart image
                    alt="Cart"
                    className="w-6 h-6 inline-block  rounded" // Adjust size accordingly
                  />
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                  onClick={closeMenu} // Close menu on click
                >
                  Your Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/Signin"
                  className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                  onClick={closeMenu} // Close menu on click
                >
                  Sign in / Out
                </Link>
              </li>
              {isLoggedIn && ( // Conditionally render the Profile link if logged in
                <li>
                  <Link
                    to="/profileview"
                    className="block py-2 px-4 text-white  rounded md:bg-transparent  md:p-2 md:rounded-lg md:hover:bg-blue-700 md:hover:text-white"
                    onClick={closeMenu} // Close menu on click
                  >
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Navbar ends here */}
    </>
  );
};

export default Nav;
