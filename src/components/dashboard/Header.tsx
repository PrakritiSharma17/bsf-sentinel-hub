import { Shield, Radio, Wifi, Satellite, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  totalDevices: number;
  activeDevices: number;
  alerts: number;
}

export const Header = ({ totalDevices, activeDevices, alerts }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">BSF Command Center</h1>
                <p className="text-xs text-muted-foreground">Real-time Border Monitoring System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                {activeDevices}/{totalDevices} Active
              </span>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-network-vhf/10 text-network-vhf border-network-vhf/30">
                <Radio className="h-3 w-3 mr-1" />
                VHF
              </Badge>
              <Badge variant="outline" className="bg-network-lorawan/10 text-network-lorawan border-network-lorawan/30">
                <Wifi className="h-3 w-3 mr-1" />
                LoRa
              </Badge>
              <Badge variant="outline" className="bg-network-lte/10 text-network-lte border-network-lte/30">
                <Satellite className="h-3 w-3 mr-1" />
                LTE
              </Badge>
              <Badge variant="outline" className="bg-network-satellite/10 text-network-satellite border-network-satellite/30">
                <Satellite className="h-3 w-3 mr-1" />
                SAT
              </Badge>
            </div>
            
            {alerts > 0 && (
              <Badge variant="destructive" className="shadow-glow-alert animate-pulse-glow">
                {alerts} Active Alerts
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
