import { Alert, AlertLevel } from '@/types/device';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertFeedProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
}

const getAlertIcon = (level: AlertLevel) => {
  if (level === 'Critical') return <AlertTriangle className="h-4 w-4" />;
  if (level === 'Warning') return <AlertTriangle className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
};

const getAlertBadgeVariant = (level: AlertLevel) => {
  if (level === 'Critical') return 'destructive';
  if (level === 'Warning') return 'default';
  return 'secondary';
};

const getAlertClass = (level: AlertLevel, acknowledged: boolean) => {
  if (acknowledged) return 'opacity-50';
  if (level === 'Critical') return 'border-destructive bg-destructive/5 animate-slide-in';
  if (level === 'Warning') return 'border-warning bg-warning/5';
  return 'border-border';
};

export const AlertFeed = ({ alerts, onAcknowledge }: AlertFeedProps) => {
  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
      {alerts.length === 0 ? (
        <Card className="p-6 text-center border-border bg-card">
          <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No active alerts</p>
        </Card>
      ) : (
        alerts.map((alert) => (
          <Card
            key={alert.id}
            className={cn(
              'p-4 transition-all duration-300',
              getAlertClass(alert.level, alert.acknowledged)
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 flex-1">
                <div className={cn(
                  "mt-0.5",
                  alert.level === 'Critical' && 'text-destructive',
                  alert.level === 'Warning' && 'text-warning',
                  alert.level === 'Info' && 'text-muted-foreground'
                )}>
                  {getAlertIcon(alert.level)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getAlertBadgeVariant(alert.level)}>
                      {alert.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {alert.deviceId}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground">{alert.message}</p>
                  
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {!alert.acknowledged && onAcknowledge && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAcknowledge(alert.id)}
                  className="shrink-0"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Ack
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
