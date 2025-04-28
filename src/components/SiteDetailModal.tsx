import React, { useEffect } from 'react';
import { X, Cuboid as Cube } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArchaeologicalSite } from '../types';
import { useNavigate } from 'react-router-dom';

interface SiteDetailModalProps {
  site: ArchaeologicalSite;
  onClose: () => void;
  toggleSidebar?: (forcedState?: boolean) => void;
}

const SiteDetailModal: React.FC<SiteDetailModalProps> = ({ site, onClose, toggleSidebar }) => {
  const navigate = useNavigate();
  const images = [
    site.image || 'https://images.pexels.com/photos/36006/renaissance-schallaburg-figures-facade.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/5227307/pexels-photo-5227307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6033675/pexels-photo-6033675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];

  useEffect(() => {
    if (toggleSidebar) {
      toggleSidebar(false);
    }
    document.body.style.overflow = 'hidden';
    const header = document.querySelector('header');
    if (header) {
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease-out';
    }
    
    return () => {
      document.body.style.overflow = '';
      const header = document.querySelector('header');
      if (header) {
        header.style.transform = 'translateY(0)';
      }
    };
  }, [toggleSidebar]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    document.body.style.overflow = '';
    const header = document.querySelector('header');
    if (header) {
      header.style.transform = 'translateY(0)';
    }
    onClose();
  };

  const handleStartTour = () => {
    handleClose();
    navigate(`/tour/${site.id}`);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl mx-4 my-auto max-h-[calc(100vh-2rem)] animate-modal-fade-in overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 bg-white dark:bg-zinc-700 rounded-full p-2 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors group"
          aria-label="Close modal"
        >
          <X size={24} className="text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors" />
        </button>

        <div className="overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 pt-12">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{site.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full text-sm font-medium">
                  {site.era}
                </span>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full text-sm font-medium">
                  {site.category}
                </span>
                {site.has3DTour && (
                  <button
                    onClick={handleStartTour}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-1 hover:bg-blue-700 transition-colors"
                  >
                    <Cube size={16} />
                    Начать 3D-тур
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-zinc-200">Описание</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {site.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-zinc-200">Локация</h2>
                  <div className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg">
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                      <strong className="text-zinc-800 dark:text-zinc-200">Регион:</strong> Greater London, United Kingdom
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                      <strong className="text-zinc-800 dark:text-zinc-200">Координаты:</strong><br />
                      Широта: {site.coordinates[0].toFixed(6)}<br />
                      Долгота: {site.coordinates[1].toFixed(6)}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      <strong className="text-zinc-800 dark:text-zinc-200">Доступ:</strong> Public access via marked footpath
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-zinc-200">Историческая справка</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {site.historicalContext || 'This site has a rich history dating back to the early period. It was primarily used for activities, and archaeological excavations have revealed numerous artifacts and structures that provide insight into the lives of the people who inhabited this area.'}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-zinc-200">Охранный статус</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Protected as a Scheduled Ancient Monument. Regular maintenance is carried out by English Heritage.
                  </p>
                </section>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900 p-8 pt-12">
              <div className="mb-8">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="h-96 rounded-lg shadow-lg"
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
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Ключевые особенности</h2>
                <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li>Original {site.era.toLowerCase()} architectural elements</li>
                  <li>Well-preserved defensive structures</li>
                  <li>Evidence of metalworking activities</li>
                  <li>Extensive ceramic assemblages</li>
                  <li>Ritual deposits in the eastern sector</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Информация для посетителей</h2>
                <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
                  <p><strong className="text-zinc-800 dark:text-zinc-200">Часы работы:</strong> Dawn to dusk</p>
                  <p><strong className="text-zinc-800 dark:text-zinc-200">Доступ:</strong> Free</p>
                  <p><strong className="text-zinc-800 dark:text-zinc-200">Удобства:</strong> Parking, Information boards</p>
                  <p><strong className="text-zinc-800 dark:text-zinc-200">Лучшее время для посещения:</strong> Spring and Summer months</p>
                  <p><strong className="text-zinc-800 dark:text-zinc-200">Доступность:</strong> Moderate - some uneven terrain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetailModal;