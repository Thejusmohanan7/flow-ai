"use client";
import React, { useState } from "react";
import { Menu, X, Moon } from "lucide-react";

const Navbar: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md px-4 md:px-6 text-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-24 md:h-28 w-auto object-contain"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <a
            href="#"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Features
          </a>

          <a
            href="#"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            About
          </a>

          <a
            href="#"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Pricing
          </a>

          <button className="hover:text-blue-500 transition-colors duration-200">
            <Moon size={20} />
          </button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 font-semibold py-2 px-5 rounded-full">
            Login
          </button>

          <button className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 font-semibold py-2 px-5 rounded-full shadow-md hover:scale-105">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col space-y-4 font-medium">

            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Features
            </a>

            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              About
            </a>

            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Pricing
            </a>

            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200">
              <Moon size={20} />
              Theme
            </button>

            <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 font-semibold py-2 rounded-full">
              Login
            </button>

            <button className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 font-semibold py-2 rounded-full">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;