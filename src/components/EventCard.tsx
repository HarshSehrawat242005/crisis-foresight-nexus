
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, MapPin, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { CrisisEvent, getCrisisTypeColor, getSeverityColor } from '@/services/crisisData';
import { formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  event: CrisisEvent;
  onClick?: (event: CrisisEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(event);
  };

  return (
    <Card 
      className="mb-3 border-l-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      style={{ borderLeftColor: getCrisisTypeColor(event.type) }}
      onClick={handleClick}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge
              className="mb-1"
              style={{ 
                backgroundColor: getSeverityColor(event.severity),
                color: 'white'
              }}
            >
              {event.severity.toUpperCase()}
            </Badge>
            <h3 className="text-base font-semibold">{event.title}</h3>
          </div>
          {!event.verified && (
            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unverified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{event.location.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarClock className="h-3 w-3 mr-1" />
            <span>{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
          </div>
          {event.affectedPopulation && (
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              <span>~{event.affectedPopulation.toLocaleString()} affected</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="py-2 px-4">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-muted-foreground">Source: {event.source}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <ExternalLink className="h-3 w-3 mr-1" />
            <span className="text-xs">Details</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
