import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { NetworkType, DeviceStatus } from '@/types/device';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  networkFilter: NetworkType | 'All';
  onNetworkFilterChange: (value: NetworkType | 'All') => void;
  statusFilter: DeviceStatus | 'All';
  onStatusFilterChange: (value: DeviceStatus | 'All') => void;
}

export const Filters = ({
  searchQuery,
  onSearchChange,
  networkFilter,
  onNetworkFilterChange,
  statusFilter,
  onStatusFilterChange,
}: FiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Device ID, Patrol ID, or Region..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      <Select value={networkFilter} onValueChange={onNetworkFilterChange}>
        <SelectTrigger className="w-[160px] bg-card border-border">
          <SelectValue placeholder="Network Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Networks</SelectItem>
          <SelectItem value="VHF">VHF</SelectItem>
          <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
          <SelectItem value="LTE">LTE</SelectItem>
          <SelectItem value="Satellite">Satellite</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[150px] bg-card border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Offline">Offline</SelectItem>
          <SelectItem value="Distress">Distress</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
