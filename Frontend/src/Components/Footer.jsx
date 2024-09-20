import React from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"
const Footer = () => {
  return (
    <>
      {/* Footer starts here */}
      <footer className="bg-gray-800 text-gray-200 rounded-lg shadow dark:bg-gray-900 m-4 mt-auto bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse ">
              <img
                // src="https://flowbite.com/docs/images/logo.svg"
                 src={logo}

                className="h-8 rounded"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-100 dark:text-gray-100">
                KP Water Suppliers
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0 dark:text-gray-400">
              <li><Link  to="/" className="hover:underline me-4 md:me-6">Home </Link></li>
              <li><Link  to="/cart" className="hover:underline me-4 md:me-6">Cart </Link></li>
              <li><Link  to="/services" className="hover:underline me-4 md:me-6">Services </Link></li>
              <li><Link  to="/about" className="hover:underline me-4 md:me-6">About </Link></li>
              
              
            </ul>
          </div>
          <hr className="my-6 border-gray-700 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-400 sm:text-center dark:text-gray-400">
            © 2024 <a href="https://flowbite.com/" className="hover:underline text-gray-300 dark:text-gray-300">KP Water Suppliers</a>. All Rights Reserved.
          </span>
        </div>
      </footer>
      {/* Footer ends here */}
    </>
  );
}

export default Footer;
