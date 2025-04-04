
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Layers, 
  Navigation, 
  AlertTriangle, 
  MapPin, 
  CheckSquare, 
  XSquare, 
  Activity,
  Home
} from 'lucide-react';

interface MapControlsProps {
  showPredictions: boolean;
  onTogglePredictions: () => void;
  onCenterMap: () => void;
  showResolved: boolean;
  onToggleResolved: () => void;
  showUserLocation: boolean;
  onToggleUserLocation: () => void;
  onReportIncident: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  showPredictions,
  onTogglePredictions,
  onCenterMap,
  showResolved,
  onToggleResolved,
  showUserLocation,
  onToggleUserLocation,
  onReportIncident
}) => {
  return (
    <div className="absolute flex flex-col gap-2 top-3 right-3 z-10">
      <Button 
        size="icon" 
        variant="secondary" 
        className="bg-background/80 backdrop-blur-sm shadow-md hover:bg-background/90"
        onClick={onCenterMap}
        title="Center Map"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      <Button 
        size="icon" 
        variant="secondary" 
        className="bg-background/80 backdrop-blur-sm shadow-md hover:bg-background/90"
        onClick={onReportIncident}
        title="Report Incident"
      >
        <AlertTriangle className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-background/80 backdrop-blur-sm shadow-md hover:bg-background/90"
            title="Map Layers"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 mr-3 p-4" align="end">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Map Layers</h4>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-crisis-red" />
                <Label htmlFor="predictions" className="text-sm">Show Predictions</Label>
              </div>
              <Switch
                id="predictions"
                checked={showPredictions}
                onCheckedChange={onTogglePredictions}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <Label htmlFor="resolved" className="text-sm">Show Resolved</Label>
              </div>
              <Switch
                id="resolved"
                checked={showResolved}
                onCheckedChange={onToggleResolved}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <Label htmlFor="userlocation" className="text-sm">Show My Location</Label>
              </div>
              <Switch
                id="userlocation"
                checked={showUserLocation}
                onCheckedChange={onToggleUserLocation}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MapControls;
