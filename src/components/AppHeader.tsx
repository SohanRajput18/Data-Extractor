import React from 'react';
import { Database } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="bg-slate-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-semibold">Data Extractor for Lead Gen</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Dashboard</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Help</a>
            </li>
          </ul>
        </nav>
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;