import React from 'react';
import { Compass, Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import { ArchaeologicalSite } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  searchResults: ArchaeologicalSite[];
  onSelectSite: (site: ArchaeologicalSite) => void;
  onResetView: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearch,
  searchResults,
  onSelectSite,
  onResetView,
  sidebarOpen,
  toggleSidebar,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu size={24} />
        </button>
        <button 
          onClick={onResetView}
          className="flex items-center text-amber-800 hover:text-amber-600 transition-colors"
        >
          <Compass size={24} className="mr-2" />
          <span className="font-semibold text-lg">ArchaeoMap</span>
        </button>
      </div>
      
      <div className="flex-1 flex justify-center max-w-2xl mx-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearch={onSearch}
          searchResults={searchResults}
          onSelectSite={onSelectSite}
        />
      </div>
      
      <div>
        <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
          Login
        </button>
      </div>
    </header>
  );
};

export default Header