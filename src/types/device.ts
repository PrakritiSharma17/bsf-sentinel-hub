export type NetworkType = 'VHF' | 'LoRaWAN' | 'LTE' | 'Satellite';
export type DeviceStatus = 'Active' | 'Offline' | 'Distress';
export type AlertLevel = 'Critical' | 'Warning' | 'Info';

export interface Device {
  id: string;
  patrolId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  networkType: NetworkType;
  status: DeviceStatus;
  battery: number;
  signalStrength: number;
  temperature: number;
  lastUpdate: Date;
  region: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  level: AlertLevel;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface NetworkStats {
  type: NetworkType;
  activeDevices: number;
  uptime: number;
  avgLatency: number;
}
