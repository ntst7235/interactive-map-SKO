import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ArchaeologicalSite } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  searchResults: ArchaeologicalSite[];
  onSelectSite: (site: ArchaeologicalSite) => void;
  moveToMarker: (coordinates: [number, number]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  searchResults,
  onSelectSite,
  moveToMarker,
}) => {
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsResultsOpen(searchQuery.length > 0 && searchResults.length > 0);
    
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsResultsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchQuery, searchResults]);

  const handleResultClick = (site: ArchaeologicalSite) => {
    onSelectSite(site);
    moveToMarker(site.coordinates);
    setIsResultsOpen(false);
    onSearch('');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <span className="bg-amber-200 dark:bg-amber-900">{text.slice(index, index + query.length)}</span>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search archaeological sites..."
          className="w-full py-3 pl-12 pr-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-zinc-400 dark:text-zinc-500" />
        </div>
      </div>
      
      {isResultsOpen && (
        <div 
          ref={resultsRef}
          className="absolute mt-2 w-full bg-white dark:bg-zinc-800 rounded-md shadow-lg py-1 z-50 max-h-60 overflow-auto custom-scrollbar"
        >
          {searchResults.map(site => (
            <div
              key={site.id}
              onClick={() => handleResultClick(site)}
              className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-zinc-700 cursor-pointer transition duration-150"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">
                {highlightMatch(site.name, searchQuery)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {site.era} · {site.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;