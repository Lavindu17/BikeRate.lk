"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2"
        >
          <Bike className="text-emerald-400" />
          <span>
            BikeRate<span className="text-emerald-400">.lk</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link
            href="#inventory"
            className="hover:text-white transition-colors"
          >
            Inventory
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        {/* Desktop Sign In Button */}
        <div className="hidden md:block">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all border border-slate-700 hover:border-slate-600">
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900 border-b border-slate-800 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
          <div className="flex flex-col gap-4 text-lg font-medium text-slate-300">
            <Link
              href="/"
              className="hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#inventory"
              className="hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inventory
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="h-px bg-slate-800 w-full"></div>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-colors">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
