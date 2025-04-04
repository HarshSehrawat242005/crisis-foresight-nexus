
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Filter, Check, AlertCircle } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { CrisisEvent } from '@/services/crisisData';

interface EventsPanelProps {
  events: CrisisEvent[];
  onEventSelect: (event: CrisisEvent) => void;
  isLoading?: boolean;
}

const EventsPanel: React.FC<EventsPanelProps> = ({ 
  events, 
  onEventSelect,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const criticalEvents = events.filter(e => e.severity === 'critical');
  const verifiedEvents = events.filter(e => e.verified);
  const unverifiedEvents = events.filter(e => !e.verified);
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4 gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="flex-shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="flex-grow flex flex-col">
        <TabsList className="mb-3">
          <TabsTrigger value="all" className="flex gap-2 items-center">
            All <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">{events.length}</span>
          </TabsTrigger>
          <TabsTrigger value="critical" className="flex gap-2 items-center">
            Critical <span className="bg-crisis-red/20 text-crisis-red text-xs py-0.5 px-2 rounded-full">{criticalEvents.length}</span>
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex gap-2 items-center">
            <Check className="h-3.5 w-3.5" />
            <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">{verifiedEvents.length}</span>
          </TabsTrigger>
          <TabsTrigger value="unverified" className="flex gap-2 items-center">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">{unverifiedEvents.length}</span>
          </TabsTrigger>
        </TabsList>

        <div className="overflow-y-auto flex-grow">
          <TabsContent value="all" className="m-0 h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading events...</div>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onClick={onEventSelect} />
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No events found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="critical" className="m-0 h-full">
            {criticalEvents.length > 0 ? (
              criticalEvents
                .filter(event => 
                  event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  event.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(event => (
                  <EventCard key={event.id} event={event} onClick={onEventSelect} />
                ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No critical events
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verified" className="m-0 h-full">
            {verifiedEvents
              .filter(event => 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(event => (
                <EventCard key={event.id} event={event} onClick={onEventSelect} />
              ))}
          </TabsContent>
          
          <TabsContent value="unverified" className="m-0 h-full">
            {unverifiedEvents
              .filter(event => 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(event => (
                <EventCard key={event.id} event={event} onClick={onEventSelect} />
              ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EventsPanel;
