import React, { useState } from 'react';
import { Filter, Sun, Moon, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Era, Category } from '../types';
import { eras, categories } from '../data/siteData';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  selectedEras: Era[];
  selectedCategories: Category[];
  has3DTour: boolean;
  updateFilters: (filters: { era?: Era[], category?: Category[], has3DTour?: boolean }) => void;
  overlayConfig: {
    enabled: boolean;
    selectedMap: string;
    opacity: number;
  };
  setOverlayConfig: React.Dispatch<React.SetStateAction<{
    enabled: boolean;
    selectedMap: string;
    opacity: number;
  }>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  toggleSidebar,
  selectedEras,
  selectedCategories,
  has3DTour,
  updateFilters,
  overlayConfig,
  setOverlayConfig,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'filters' | 'comparison'>('filters');
  const navigate = useNavigate();

  const handleEraChange = (era: Era) => {
    const newSelectedEras = selectedEras.includes(era)
      ? selectedEras.filter(e => e !== era)
      : [...selectedEras, era];
    updateFilters({ era: newSelectedEras });
  };

  const handleCategoryChange = (category: Category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    updateFilters({ category: newSelectedCategories });
  };

  const handle3DTourChange = () => {
    updateFilters({ has3DTour: !has3DTour });
  };

  const handleMapSelect = (mapType: string) => {
    setOverlayConfig(prev => ({
      ...prev,
      selectedMap: mapType
    }));
  };

  const handleOverlayToggle = (enabled: boolean) => {
    setOverlayConfig(prev => ({
      ...prev,
      enabled
    }));
  };

  const handleOpacityChange = (opacity: number) => {
    setOverlayConfig(prev => ({
      ...prev,
      opacity
    }));
  };

  const handleCompare = () => {
    navigate('/compare');
  };

  const handleSectionChange = (section: 'filters' | 'comparison') => {
    if (open && activeSection === section) {
      toggleSidebar();
    } else {
      if (!open) {
        toggleSidebar();
      }
      setActiveSection(section);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 z-40 flex">
      <div className="w-12 bg-white dark:bg-zinc-800 shadow-lg flex flex-col items-center py-4">
        <button
          onClick={() => handleSectionChange('filters')}
          className={`p-2 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            open && activeSection === 'filters' ? 'bg-zinc-100 dark:bg-zinc-700 text-amber-600' : 'text-zinc-700 dark:text-zinc-300'
          }`}
          aria-label="Show filters"
        >
          <Filter size={24} />
        </button>
        
        <button
          onClick={() => handleSectionChange('comparison')}
          className={`mt-2 p-2 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            open && activeSection === 'comparison' ? 'bg-zinc-100 dark:bg-zinc-700 text-amber-600' : 'text-zinc-700 dark:text-zinc-300'
          }`}
          aria-label="Show map comparison"
        >
          <Layers size={24} />
        </button>
        
        <div className="flex-1" />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>

      <div 
        className={`bg-white dark:bg-zinc-800 shadow-lg transition-all duration-300 ease-in-out ${
          open ? 'w-80 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="h-full">
          <div className="p-6 w-80 h-full overflow-y-auto custom-scrollbar">
            {activeSection === 'filters' ? (
              <>
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">Filters</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-zinc-800 dark:text-zinc-200">Eras</h3>
                    <div className="space-y-2">
                      {eras.map(era => (
                        <label key={era} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEras.includes(era as Era)}
                            onChange={() => handleEraChange(era as Era)}
                            className="rounded text-amber-600 focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
                          />
                          <span className="text-zinc-700 dark:text-zinc-300">{era}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-zinc-800 dark:text-zinc-200">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category as Category)}
                            onChange={() => handleCategoryChange(category as Category)}
                            className="rounded text-amber-600 focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
                          />
                          <span className="text-zinc-700 dark:text-zinc-300">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 text-zinc-800 dark:text-zinc-200">Tags</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={has3DTour}
                          onChange={handle3DTourChange}
                          className="rounded text-amber-600 focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <span className="text-zinc-700 dark:text-zinc-300">Has 3D Tour</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">Map Comparison</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-zinc-800 dark:text-zinc-200">Available Maps</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="compareMap"
                          checked={overlayConfig.selectedMap === 'historical'}
                          onChange={() => handleMapSelect('historical')}
                          className="text-amber-600 focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <span className="text-zinc-700 dark:text-zinc-300">Historical Map (1900)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overlayConfig.enabled}
                        onChange={(e) => handleOverlayToggle(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300">Enable Overlay</span>
                    </label>
                  </div>

                  {overlayConfig.enabled && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Transparency
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overlayConfig.opacity}
                        onChange={(e) => handleOpacityChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                      />
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {overlayConfig.opacity}%
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCompare}
                    className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Compare Maps
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;