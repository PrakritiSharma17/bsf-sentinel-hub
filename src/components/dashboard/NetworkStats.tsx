import { NetworkStats as NetworkStatsType } from '@/types/device';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Radio, Wifi, Satellite, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkStatsProps {
  stats: NetworkStatsType[];
}

const getNetworkIcon = (type: string) => {
  const icons = {
    VHF: Radio,
    LoRaWAN: Wifi,
    LTE: Satellite,
    Satellite: Satellite,
  };
  const Icon = icons[type as keyof typeof icons] || Activity;
  return <Icon className="h-5 w-5" />;
};

const getNetworkColorClass = (type: string) => {
  const classes = {
    VHF: 'text-network-vhf',
    LoRaWAN: 'text-network-lorawan',
    LTE: 'text-network-lte',
    Satellite: 'text-network-satellite',
  };
  return classes[type as keyof typeof classes] || 'text-foreground';
};

const getProgressColorClass = (type: string) => {
  const classes = {
    VHF: 'bg-network-vhf',
    LoRaWAN: 'bg-network-lorawan',
    LTE: 'bg-network-lte',
    Satellite: 'bg-network-satellite',
  };
  return classes[type as keyof typeof classes] || 'bg-primary';
};

export const NetworkStats = ({ stats }: NetworkStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.type} className="p-4 border-border bg-card hover:shadow-tactical transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className={cn("flex items-center gap-2", getNetworkColorClass(stat.type))}>
              {getNetworkIcon(stat.type)}
              <h3 className="font-semibold">{stat.type}</h3>
            </div>
            <span className="text-2xl font-bold text-foreground">{stat.activeDevices}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium text-foreground">{stat.uptime.toFixed(1)}%</span>
              </div>
              <Progress value={stat.uptime} className={getProgressColorClass(stat.type)} />
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg Latency</span>
                <span className="font-medium text-foreground">{stat.avgLatency}ms</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
