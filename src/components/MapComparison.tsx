import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComparison: React.FC = () => {
  const navigate = useNavigate();
  const leftMapRef = useRef<L.Map | null>(null);
  const rightMapRef = useRef<L.Map | null>(null);
  const leftCursorRef = useRef<L.Marker | null>(null);
  const rightCursorRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const bounds: L.LatLngBoundsExpression = [
      [51.538597, 64.347327],
      [55.784217, 72.030899]
    ];

    // Initialize left map
    leftMapRef.current = L.map('leftMap', {
      center: [54.88, 69.15],
      zoom: 8,
      minZoom: 7,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    // Initialize right map
    rightMapRef.current = L.map('rightMap', {
      center: [54.88, 69.15],
      zoom: 8,
      minZoom: 7,
      dragging: true,
      zoomControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    // Add base layers to left map
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Satellite'
    });

    const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors'
    });

    const hybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Hybrid'
    });

    const baseLayers = {
      'Standard Map': osm,
      'Satellite': satellite,
      'Terrain': terrain,
      'Hybrid': hybrid
    };

    osm.addTo(leftMapRef.current);
    L.control.layers(baseLayers).addTo(leftMapRef.current);

    // Add historical map to right map
    const imageUrl = '/historical-maps/petropavlovskiy-uezd-1912.jpg';
    const overlay = L.imageOverlay(imageUrl, bounds).addTo(rightMapRef.current);

    // Sync maps
    leftMapRef.current.on('move', () => {
      if (leftMapRef.current && rightMapRef.current) {
        rightMapRef.current.setView(
          leftMapRef.current.getCenter(),
          leftMapRef.current.getZoom()
        );
      }
    });

    // Initialize cursors
    const cursorIcon = L.divIcon({
      className: 'custom-cursor',
      html: '+',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    leftCursorRef.current = L.marker([54.88, 69.15], {
      icon: cursorIcon
    }).addTo(leftMapRef.current);

    rightCursorRef.current = L.marker([54.88, 69.15], {
      icon: cursorIcon
    }).addTo(rightMapRef.current);

    const updateCursors = (e: L.LeafletMouseEvent) => {
      if (leftCursorRef.current && rightCursorRef.current) {
        leftCursorRef.current.setLatLng(e.latlng);
        rightCursorRef.current.setLatLng(e.latlng);
      }
    };

    leftMapRef.current.on('mousemove', updateCursors);
    rightMapRef.current.on('mousemove', updateCursors);

    return () => {
      leftMapRef.current?.remove();
      rightMapRef.current?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          Вернуться на карту
        </button>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div id="leftMap" className="flex-1" />
        <div id="rightMap" className="flex-1" />
      </div>
    </div>
  );
};

export default MapComparison;