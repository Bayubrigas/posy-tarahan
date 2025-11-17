'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-800">
                  Sistem Informasi
                </div>
                <div className="text-xs text-gray-600">
                  Data Posyandu
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative">
              <button
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Tentang
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <Link
                    href="/tentang"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  >
                    Tentang Sistem
                  </Link>
                  <Link
                    href="/kontak"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  >
                    Kontak
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/privacy"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Kebijakan Privasi
            </Link>
            
            <Link
              href="/security"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Kebijakan Keamanan Informasi
            </Link>

            <Button
              asChild
              className="ml-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/tentang"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md"
            >
              Tentang Sistem
            </Link>
            <Link
              href="/privacy"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/security"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md"
            >
              Kebijakan Keamanan Informasi
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-md"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}