import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/dashboard/Header';
import { TacticalMap } from '@/components/dashboard/TacticalMap';
import { DeviceCard } from '@/components/dashboard/DeviceCard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { NetworkStats } from '@/components/dashboard/NetworkStats';
import { Filters } from '@/components/dashboard/Filters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { generateMockDevices, generateMockAlerts, calculateNetworkStats } from '@/utils/mockData';
import { Device, Alert, NetworkType, DeviceStatus } from '@/types/device';
import { Map, Grid, Bell } from 'lucide-react';

const Index = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState<NetworkType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'All'>('All');

  // Initialize mock data
  useEffect(() => {
    const initialDevices = generateMockDevices(24);
    setDevices(initialDevices);
    setAlerts(generateMockAlerts(initialDevices));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        battery: Math.max(0, device.battery - Math.random() * 0.5),
        signalStrength: Math.max(0, Math.min(100, device.signalStrength + (Math.random() - 0.5) * 10)),
        temperature: Math.floor(Math.random() * 30 + 20),
        lastUpdate: new Date(),
        location: {
          ...device.location,
          lat: device.location.lat + (Math.random() - 0.5) * 0.001,
          lng: device.location.lng + (Math.random() - 0.5) * 0.001,
        },
      })));

      // Occasionally add new alerts
      if (Math.random() > 0.8) {
        setAlerts(prev => {
          const newAlerts = generateMockAlerts(devices);
          return [...newAlerts.slice(0, 1), ...prev].slice(0, 20);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = 
        device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.patrolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.region.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesNetwork = networkFilter === 'All' || device.networkType === networkFilter;
      const matchesStatus = statusFilter === 'All' || device.status === statusFilter;

      return matchesSearch && matchesNetwork && matchesStatus;
    });
  }, [devices, searchQuery, networkFilter, statusFilter]);

  const networkStats = useMemo(() => calculateNetworkStats(devices), [devices]);
  const activeDevices = devices.filter(d => d.status === 'Active').length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        totalDevices={devices.length}
        activeDevices={activeDevices}
        alerts={activeAlerts}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Network Stats */}
        <NetworkStats stats={networkStats} />

        {/* Main Content */}
        <Tabs defaultValue="map" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Tactical Map
              </TabsTrigger>
              <TabsTrigger value="grid" className="gap-2">
                <Grid className="h-4 w-4" />
                Device Grid
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2">
                <Bell className="h-4 w-4" />
                Alerts ({activeAlerts})
              </TabsTrigger>
            </TabsList>

            <Filters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              networkFilter={networkFilter}
              onNetworkFilterChange={setNetworkFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>

          <TabsContent value="map" className="m-0">
            <Card className="border-border bg-card p-0 overflow-hidden">
              <div className="h-[600px]">
                <TacticalMap devices={filteredDevices} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDevices.map(device => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
            {filteredDevices.length === 0 && (
              <Card className="p-12 text-center border-border bg-card">
                <p className="text-muted-foreground">No devices match your filters</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="m-0">
            <Card className="border-border bg-card p-6">
              <AlertFeed alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
