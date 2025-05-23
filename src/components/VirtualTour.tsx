import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { CubemapAdapter } from "@photo-sphere-viewer/cubemap-adapter";
import panoramasInfo from '../data/panoramasInfo.json';

interface Location {
  id: string;
  name: string;
  era: string;
  category: string;
  description: string;
  coordinates: [number, number];
  image?: string;
  has3DTour?: boolean;
}

const VirtualTour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPanorama, setCurrentPanorama] = useState('');
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`/api/locations/${id}`);
        if (!response.ok) {
          throw new Error('Location not found');
        }
        const data = await response.json();
        setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load location');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocation();
    }
  }, [id]);

  useEffect(() => {
    const tour = panoramasInfo.find(p => p.id.toString() === id);
    if (tour) {
      setCurrentPanorama(tour.initialPanorama);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading tour...</h2>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Tour not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-amber-600 hover:text-amber-800 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  const tour = panoramasInfo.find(p => p.id.toString() === id);
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour data not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-amber-600 hover:text-amber-800 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  const currentScene = currentPanorama && tour.panoramas[currentPanorama];
  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading scene...</h2>
        </div>
      </div>
    );
  }

  const handleHotspotClick = (hotspotData: any) => {
    if (hotspotData.type === 'panorama') {
      setCurrentPanorama(hotspotData.targetPanorama);
    } else if (hotspotData.type === 'image' && hotspotData.image) {
      setImageModalUrl(hotspotData.image);
    }
  };

  return (
    <div className="h-screen w-screen bg-black relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft size={20} />
          Вернуться на карту
        </button>
        <h1 className="text-white text-xl font-semibold">
          {location.name} - {currentScene.name}
        </h1>
      </div>

      <div className="h-full w-full">
        <ReactPhotoSphereViewer
          src={currentScene.image}
          height="100vh"
          width="100%"
          adapter={CubemapAdapter}
          panorama={{
            type: 'stripe',
            path: currentScene.image,
            flipTopBottom: true,
            order: ['left', 'front', 'right', 'back', 'top', 'bottom'],
          }}
          keyboard={false}
          container="div"
          defaultZoomLvl={0}
          littlePlanet={false}
          plugins={[]}
          // markers={currentScene.hotspots.map(hotspot => ({
          //   id: hotspot.id,
          //   longitude: hotspot.yaw * (Math.PI / 180),
          //   latitude: hotspot.pitch * (Math.PI / 180),
          //   html: hotspot.text,
          //   style: {
          //     color: 'white',
          //     backgroundColor: hotspot.type === 'panorama' ? '#2563eb' : '#d97706',
          //     padding: '5px 10px',
          //     borderRadius: '20px',
          //     cursor: 'pointer'
          //   },
          //   content: hotspot.text,
          //   data: hotspot
          // }))}
          // onClick={(_, marker) => {
          //   if (marker) {
          //     handleHotspotClick(marker.data);
          //   }
          // }}
        />
      </div>

      {imageModalUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setImageModalUrl(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={imageModalUrl}
            alt="Artifact detail"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default VirtualTour;