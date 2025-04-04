
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CrisisEvent } from '@/services/crisisData';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, Flame, CloudRain } from 'lucide-react';

interface PredictivePanelProps {
  activeEvent?: CrisisEvent;
}

const PredictivePanel: React.FC<PredictivePanelProps> = ({ activeEvent }) => {
  if (!activeEvent) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Predictive Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100%-5rem)]">
          <div className="text-center text-muted-foreground">
            <p>Select an event to view predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Since this is a demo, we're only showing predictive content for wildfires
  if (activeEvent.type === 'wildfire') {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-crisis-red" />
              Wildfire Spread Prediction
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Predicted Spread (24 hours)</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1 rounded bg-crisis-red/20 text-crisis-red">Northeast: 2.4 miles</div>
              <ArrowRightCircle className="h-4 w-4 text-muted-foreground" />
              <div className="p-1 rounded bg-yellow-600/20 text-yellow-600">East: 1.8 miles</div>
              <ArrowRightCircle className="h-4 w-4 text-muted-foreground" />
              <div className="p-1 rounded bg-orange-500/20 text-orange-500">Southeast: 1.2 miles</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Containment Forecast</h4>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 text-sm border-b pb-1">
                <div className="col-span-1 font-medium">Time</div>
                <div className="col-span-1 font-medium">Containment</div>
                <div className="col-span-2 font-medium">Confidence</div>
              </div>
              <div className="grid grid-cols-4 text-sm">
                <div>12 hours</div>
                <div>10%</div>
                <div className="col-span-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-crisis-amber h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 text-sm">
                <div>24 hours</div>
                <div>25%</div>
                <div className="col-span-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-crisis-amber h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 text-sm">
                <div>48 hours</div>
                <div>60%</div>
                <div className="col-span-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-crisis-amber h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Weather Impact</h4>
            <div className="flex gap-3 mb-2">
              <div className="flex items-center gap-1 text-sm">
                <CloudRain className="h-4 w-4" />
                <span>0% precipitation</span>
              </div>
              <div className="text-sm">Wind: 15mph NE</div>
              <div className="text-sm">Humidity: 20%</div>
            </div>
            <div className="p-2 bg-crisis-red/10 text-crisis-red rounded text-sm">
              High-risk weather conditions forecast for next 24 hours
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              View detailed models
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (activeEvent.type === 'flood') {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-500" />
              Flood Risk Analysis
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Flood prediction model available but not activated for this event
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Run flood prediction model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Predictive Analytics</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[calc(100%-5rem)]">
        <div className="text-center text-muted-foreground">
          <p>No predictive models available for this event type</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictivePanel;
