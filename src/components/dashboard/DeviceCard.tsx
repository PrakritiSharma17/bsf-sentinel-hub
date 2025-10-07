import { Device } from '@/types/device';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radio, Battery, Signal, Thermometer, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceCardProps {
  device: Device;
}

const getNetworkBadgeClass = (type: string) => {
  const classes = {
    VHF: 'bg-network-vhf/10 text-network-vhf border-network-vhf/30',
    LoRaWAN: 'bg-network-lorawan/10 text-network-lorawan border-network-lorawan/30',
    LTE: 'bg-network-lte/10 text-network-lte border-network-lte/30',
    Satellite: 'bg-network-satellite/10 text-network-satellite border-network-satellite/30',
  };
  return classes[type as keyof typeof classes] || '';
};

const getStatusBadgeVariant = (status: string) => {
  if (status === 'Distress') return 'destructive';
  if (status === 'Offline') return 'secondary';
  return 'default';
};

export const DeviceCard = ({ device }: DeviceCardProps) => {
  const batteryColor = device.battery > 50 ? 'bg-success' : device.battery > 20 ? 'bg-warning' : 'bg-destructive';
  const signalColor = device.signalStrength > 50 ? 'bg-success' : device.signalStrength > 20 ? 'bg-warning' : 'bg-destructive';

  return (
    <Card className={cn(
      "p-4 hover:shadow-tactical transition-all duration-300 border-border bg-card",
      device.status === 'Distress' && "border-destructive shadow-glow-alert animate-pulse-glow"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{device.id}</h3>
          <p className="text-xs text-muted-foreground">{device.patrolId}</p>
        </div>
        <div className="flex gap-1.5">
          <Badge variant="outline" className={getNetworkBadgeClass(device.networkType)}>
            <Radio className="h-3 w-3 mr-1" />
            {device.networkType}
          </Badge>
          <Badge variant={getStatusBadgeVariant(device.status)}>
            {device.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Battery className="h-4 w-4" />
            <span>Battery</span>
          </div>
          <span className="font-medium text-foreground">{device.battery}%</span>
        </div>
        <Progress value={device.battery} className={batteryColor} />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Signal className="h-4 w-4" />
            <span>Signal</span>
          </div>
          <span className="font-medium text-foreground">{device.signalStrength}%</span>
        </div>
        <Progress value={device.signalStrength} className={signalColor} />

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs">
            <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">{device.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">{device.region}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated {new Date(device.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};
