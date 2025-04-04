
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CrisisEvent, SeverityLevel, getSeverityColor } from '@/services/crisisData';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ResourcesNeededPanelProps {
  events: CrisisEvent[];
}

const ResourcesNeededPanel: React.FC<ResourcesNeededPanelProps> = ({ events }) => {
  const resourceNeeds = events
    .filter(event => event.resourceNeeds && event.resourceNeeds.length > 0)
    .flatMap(event => 
      (event.resourceNeeds || []).map(need => ({
        ...need,
        eventId: event.id,
        eventTitle: event.title,
        location: event.location.name
      }))
    )
    .sort((a, b) => {
      const urgencyOrder: Record<SeverityLevel, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3
      };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Resource Needs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[calc(100%-4rem)]">
        {resourceNeeds.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No resource needs reported
          </div>
        ) : (
          <div className="space-y-3">
            {resourceNeeds.map((need, index) => (
              <div
                key={`${need.eventId}-${index}`}
                className="p-3 border rounded-md bg-card/50"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium">{need.type}</div>
                  <Badge
                    className="ml-2 text-xs"
                    style={{ 
                      backgroundColor: getSeverityColor(need.urgency),
                      color: 'white'
                    }}
                  >
                    {need.urgency}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{need.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{need.location}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{need.eventTitle}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourcesNeededPanel;
