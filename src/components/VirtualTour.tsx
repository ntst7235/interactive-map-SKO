import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { CubemapAdapter } from "@photo-sphere-viewer/cubemap-adapter";
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

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

interface Panorama {
  name: string;
  initialPanorama: string;
  scenes: {
    id: string;
    name: string;
    image: string;
    hotspots: {
      type: 'panorama' | 'image';
      id: string;
      targetPanorama: string;
      pitch?: number;
      yaw?: number;
      text?: string;
      image?: string;
    }[];
  }[];
}

const VirtualTour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPanorama, setCurrentPanorama] = useState<string>('');
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [panoramaData, setPanoramaData] = useState<Panorama | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerInstance, setViewerInstance] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch location data
        const locationResponse = await fetch(`/api/locations/${id}`);
        if (!locationResponse.ok) {
          throw new Error('Location not found');
        }
        const locationData = await locationResponse.json();
        setLocation(locationData);

        // Fetch panorama data
        const panoramaResponse = await fetch(`/api/locations/${id}/panorama`);
        if (!panoramaResponse.ok) {
          throw new Error('Panorama not found');
        }
        const panoramaData = await panoramaResponse.json();
        setPanoramaData(panoramaData);
        setCurrentPanorama(panoramaData.initialPanorama);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tour data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleViewerReady = (instance: any) => {
    setViewerInstance(instance);
    const markersPlugin = instance.getPlugin(MarkersPlugin);
    if (!markersPlugin) return;

    const currentScene = panoramaData?.scenes.find(scene => scene.id === currentPanorama);
    if (!currentScene?.hotspots) return;

    markersPlugin.clearMarkers();

    currentScene.hotspots.forEach(hotspot => {
      if (hotspot.yaw !== undefined && hotspot.pitch !== undefined) {
        markersPlugin.addMarker({
          id: hotspot.id,
          position: {
            yaw: `${hotspot.yaw}deg`,
            pitch: `${hotspot.pitch}deg`
          },

          // image: hotspot.type === 'panorama' 
          //   ? '/icons/panorama-marker.png'
          //   : '/icons/info-marker.png',

          html: hotspot.text,
          style: {
              color: 'white',
              backgroundColor: hotspot.type === 'panorama' ? '#2563eb' : '#d97706',
              padding: '5px 10px',
              borderRadius: '20px',
              cursor: 'pointer'
            },
            
          size: { width: 32, height: 32 },
          anchor: 'bottom center',
          tooltip: {
            content: hotspot.text || '',
            position: 'top'
          },
          data: hotspot
        });
      }
    });

    markersPlugin.addEventListener('select-marker', (e: any) => {
      const hotspotData = e.marker.config.data;
      handleHotspotClick(hotspotData);
    });
  };

  useEffect(() => {
    if (viewerInstance) {
      handleViewerReady(viewerInstance);
    }
  }, [currentPanorama, viewerInstance]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading tour...</h2>
        </div>
      </div>
    );
  }

  if (error || !location || !panoramaData) {
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

  const currentScene = panoramaData.scenes.find(scene => scene.id === currentPanorama);
  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Scene not found</h2>
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
          plugins={[MarkersPlugin]}
          onReady={handleViewerReady}
          container="div"
          defaultZoomLvl={0}
          littlePlanet={false}
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