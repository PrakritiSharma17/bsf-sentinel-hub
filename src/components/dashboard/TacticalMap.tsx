import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Device, NetworkType } from '@/types/device';

interface TacticalMapProps {
  devices: Device[];
  onDeviceClick?: (device: Device) => void;
}

const getNetworkColor = (type: NetworkType): string => {
  const colors = {
    VHF: '#3b82f6',
    LoRaWAN: '#22c55e',
    LTE: '#f97316',
    Satellite: '#ef4444',
  };
  return colors[type];
};

export const TacticalMap = ({ devices, onDeviceClick }: TacticalMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([28.6, 77.2], 10);

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentMarkers = markersRef.current;

    // Remove markers that no longer exist
    const currentDeviceIds = new Set(devices.map(d => d.id));
    currentMarkers.forEach((marker, id) => {
      if (!currentDeviceIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    devices.forEach(device => {
      const color = getNetworkColor(device.networkType);
      const existingMarker = currentMarkers.get(device.id);

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLatLng([device.location.lat, device.location.lng]);
        existingMarker.setStyle({
          fillColor: color,
          color: color,
          fillOpacity: device.status === 'Active' ? 0.8 : 0.4,
        });
      } else {
        // Create new marker
        const marker = L.circleMarker([device.location.lat, device.location.lng], {
          radius: device.status === 'Distress' ? 12 : 8,
          fillColor: color,
          color: color,
          weight: device.status === 'Distress' ? 3 : 2,
          opacity: 1,
          fillOpacity: device.status === 'Active' ? 0.8 : 0.4,
          className: device.status === 'Distress' ? 'animate-ping-slow' : '',
        }).addTo(map);

        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <div class="font-bold text-sm mb-1">${device.id}</div>
            <div class="text-xs space-y-1">
              <div><span class="font-medium">Network:</span> ${device.networkType}</div>
              <div><span class="font-medium">Status:</span> ${device.status}</div>
              <div><span class="font-medium">Battery:</span> ${device.battery}%</div>
              <div><span class="font-medium">Signal:</span> ${device.signalStrength}%</div>
              <div><span class="font-medium">Temp:</span> ${device.temperature}°C</div>
              <div><span class="font-medium">Updated:</span> ${new Date(device.lastUpdate).toLocaleTimeString()}</div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        if (onDeviceClick) {
          marker.on('click', () => onDeviceClick(device));
        }

        currentMarkers.set(device.id, marker);
      }
    });
  }, [devices, onDeviceClick]);

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainerRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-md p-3 text-xs space-y-1.5 z-[1000]">
        <div className="font-semibold text-foreground mb-2">Network Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-network-vhf"></div>
          <span className="text-muted-foreground">VHF</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-network-lorawan"></div>
          <span className="text-muted-foreground">LoRaWAN</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-network-lte"></div>
          <span className="text-muted-foreground">LTE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-network-satellite"></div>
          <span className="text-muted-foreground">Satellite</span>
        </div>
      </div>
    </div>
  );
};
