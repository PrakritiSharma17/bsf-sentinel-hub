import { Device, Alert, NetworkStats, NetworkType, DeviceStatus, AlertLevel } from '@/types/device';

const regions = ['North Border', 'East Sector', 'West Zone', 'South Perimeter'];
const networkTypes: NetworkType[] = ['VHF', 'LoRaWAN', 'LTE', 'Satellite'];

export const generateMockDevices = (count: number): Device[] => {
  const devices: Device[] = [];
  
  for (let i = 0; i < count; i++) {
    const lat = 28.6 + (Math.random() - 0.5) * 2;
    const lng = 77.2 + (Math.random() - 0.5) * 2;
    
    devices.push({
      id: `BSF-${String(i + 1).padStart(3, '0')}`,
      patrolId: `PTL-${String(Math.floor(i / 3) + 1).padStart(2, '0')}`,
      name: `Unit ${i + 1}`,
      location: {
        lat,
        lng,
        accuracy: Math.random() * 10 + 2,
      },
      networkType: networkTypes[Math.floor(Math.random() * networkTypes.length)],
      status: Math.random() > 0.9 ? 'Offline' : Math.random() > 0.95 ? 'Distress' : 'Active',
      battery: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 30 + 20),
      lastUpdate: new Date(Date.now() - Math.random() * 300000),
      region: regions[Math.floor(Math.random() * regions.length)],
    });
  }
  
  return devices;
};

export const generateMockAlerts = (devices: Device[]): Alert[] => {
  const alerts: Alert[] = [];
  const alertMessages = [
    'Low battery warning',
    'Weak signal detected',
    'Device crossed geofence',
    'Network handover initiated',
    'Temperature threshold exceeded',
    'Distress signal activated',
  ];
  
  devices.forEach((device, i) => {
    if (Math.random() > 0.7) {
      const level: AlertLevel = 
        device.status === 'Distress' ? 'Critical' :
        device.battery < 20 ? 'Warning' : 'Info';
        
      alerts.push({
        id: `ALT-${String(i + 1).padStart(4, '0')}`,
        deviceId: device.id,
        level,
        message: device.status === 'Distress' 
          ? 'Distress signal activated'
          : alertMessages[Math.floor(Math.random() * alertMessages.length)],
        timestamp: new Date(Date.now() - Math.random() * 600000),
        acknowledged: Math.random() > 0.5,
      });
    }
  });
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const calculateNetworkStats = (devices: Device[]): NetworkStats[] => {
  return networkTypes.map(type => {
    const typeDevices = devices.filter(d => d.networkType === type);
    const activeDevices = typeDevices.filter(d => d.status === 'Active').length;
    
    return {
      type,
      activeDevices: typeDevices.length,
      uptime: activeDevices / typeDevices.length * 100 || 0,
      avgLatency: Math.floor(Math.random() * 100 + 50),
    };
  });
};
