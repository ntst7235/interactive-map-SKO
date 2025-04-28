import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArchaeologicalSite } from '../types';
import SiteDetailModal from './SiteDetailModal';

interface SiteDetailPanelProps {
  site: ArchaeologicalSite;
  onClose: () => void;
  toggleSidebar?: (forcedState?: boolean) => void;
}

const SiteDetailPanel: React.FC<SiteDetailPanelProps> = ({ site, onClose, toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = [
    site.image || 'https://images.pexels.com/photos/36006/renaissance-schallaburg-figures-facade.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/5227307/pexels-photo-5227307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6033675/pexels-photo-6033675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];

  return (
    <>
      <div className="absolute right-5 top-20 bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-96 overflow-hidden z-40 animate-slide-in-right">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white dark:bg-zinc-700 rounded-full p-1 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors z-10"
        >
          <X size={20} className="text-zinc-600 dark:text-zinc-300" />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="h-56 w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${site.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="p-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{site.name}</h2>
          
          <div className="flex space-x-2 mb-4">
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-md text-xs font-medium">
              {site.era}
            </span>
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-md text-xs font-medium">
              {site.category}
            </span>
            {site.has3DTour 
              ? (<span className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-medium">Есть 3D-тур</span>)
              : (<span className="px-2 py-1 bg-blue-900 text-white rounded-md text-xs font-medium">Нет 3D-тура</span>)}
          </div>
          
          <p className="text-zinc-700 dark:text-zinc-300 mb-4 text-sm leading-relaxed">{site.description}</p>
          
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
            <h3 className="font-medium mb-2 text-zinc-900 dark:text-zinc-100">Локация:</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Широта: {site.coordinates[0].toFixed(4)}<br />
              Долгота: {site.coordinates[1].toFixed(4)}
            </p>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 text-sm font-medium transition-colors"
            >
              Посмотреть полную информацию
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SiteDetailModal 
          site={site} 
          onClose={() => setIsModalOpen(false)} 
          toggleSidebar={toggleSidebar}
        />
      )}
    </>
  );
};

export default SiteDetailPanel;