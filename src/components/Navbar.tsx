'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
// Import useEffect and useRef
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';
  const [salesDropdownOpen, setSalesDropdownOpen] = useState(false);
  // Create refs for the dropdown button and menu
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isSalesReport = pathname === '/sales-report';

  // Get display name for current filter (unchanged)
  const getFilterDisplayName = (filter: string) => {
    switch(filter) {
      case 'today': return 'Dzisiaj';
      case 'yesterday': return 'Wczoraj';
      case 'month': return 'Ostatnie 30 dni';
      default: return 'Wszystkie';
    }
  };

  // Add useEffect hook to handle outside clicks
  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the button and the dropdown menu
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSalesDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener only when the dropdown is open
    if (salesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove listener if dropdown is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove listener on component unmount or when dropdown closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [salesDropdownOpen]); // Dependency array ensures effect runs when salesDropdownOpen changes

  return (
    <nav className="bg-gray-900 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning={true}>
        <div className="flex justify-between h-16" suppressHydrationWarning={true}>
          <div className="flex items-center space-x-6" suppressHydrationWarning={true}>
            {/* Inventory Link (unchanged) */}
            <Link 
              href="/inventory" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/inventory' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-200 hover:text-white hover:bg-gray-800'
              }`}
            >
              Stan magazynowy
            </Link>
            
            {/* Sales report dropdown */}
            <div className="relative" suppressHydrationWarning={true}>
              {/* Attach ref to the button */}
              <button
                ref={buttonRef} 
                onClick={() => setSalesDropdownOpen(!salesDropdownOpen)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  isSalesReport
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-200 hover:text-white hover:bg-gray-800'
                }`}
              >
                Raport sprzedaży {isSalesReport && `: ${getFilterDisplayName(currentFilter)}`}
                {/* SVG Icon (unchanged) */}
                <svg 
                  className="ml-1 h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
              
              {salesDropdownOpen && (
                // Attach ref to the dropdown menu container
                <div 
                  ref={dropdownRef} 
                  className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {/* Dropdown Links (unchanged) */}
                    <Link
                      href="/sales-report?filter=all"
                      className={`block px-4 py-2 text-sm ${
                        isSalesReport && currentFilter === 'all'
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setSalesDropdownOpen(false)}
                    >
                      Wszystkie
                    </Link>
                    <Link
                      href="/sales-report?filter=today"
                      className={`block px-4 py-2 text-sm ${
                        isSalesReport && currentFilter === 'today'
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setSalesDropdownOpen(false)}
                    >
                      Dzisiaj
                    </Link>
                    <Link
                      href="/sales-report?filter=yesterday"
                      className={`block px-4 py-2 text-sm ${
                        isSalesReport && currentFilter === 'yesterday'
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setSalesDropdownOpen(false)}
                    >
                      Wczoraj
                    </Link>
                    <Link
                      href="/sales-report?filter=month"
                      className={`block px-4 py-2 text-sm ${
                        isSalesReport && currentFilter === 'month'
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setSalesDropdownOpen(false)}
                    >
                      Ostatnie 30 dni
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}