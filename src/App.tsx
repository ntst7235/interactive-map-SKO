import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import VirtualTour from './components/VirtualTour';
import SearchBar from './components/SearchBar';
import { useMapState } from './hooks/useMapState';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const {
    mapState,
    filters,
    sidebarOpen,
    filteredSites,
    searchResults,
    selectSite,
    updateFilters,
    toggleSidebar,
    resetView,
    moveToMarker,
  } = useMapState();

  useEffect(() => {
    document.title = 'Интерактивная карта СКО';
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/tour/:id" element={<VirtualTour />} />
          <Route
            path="/"
            element={
              <div className="h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative">
                <div className="absolute top-4 right-4 z-50 w-96">
                  <SearchBar
                    searchQuery={filters.searchQuery}
                    onSearch={(query) => updateFilters({ searchQuery: query })}
                    searchResults={searchResults}
                    onSelectSite={selectSite}
                    moveToMarker={moveToMarker}
                  />
                </div>
                
                <div className="h-full relative">
                  <Sidebar
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    selectedEras={filters.era}
                    selectedCategories={filters.category}
                    has3DTour={filters.has3DTour}
                    updateFilters={updateFilters}
                  />
                  
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      sidebarOpen ? 'ml-[336px]' : 'ml-12'
                    }`}
                  >
                    <Map
                      mapState={mapState}
                      sites={filteredSites}
                      onSelectSite={selectSite}
                      sidebarOpen={sidebarOpen}
                      toggleSidebar={toggleSidebar}
                    />
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;