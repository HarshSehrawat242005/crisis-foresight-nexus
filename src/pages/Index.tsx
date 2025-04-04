
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import EventsPanel from '@/components/EventsPanel';
import OverviewPanel from '@/components/OverviewPanel';
import ResourcesNeededPanel from '@/components/ResourcesNeededPanel';
import PredictivePanel from '@/components/PredictivePanel';
import CrisisReportModal from '@/components/CrisisReportModal';
import { getCrisisEvents, CrisisEvent } from '@/services/crisisData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CrisisEvent | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  // Fetch crisis events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCrisisEvents();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crisis events:', error);
        setLoading(false);
        toast.error('Failed to load crisis data. Please refresh the page.');
      }
    };

    fetchEvents();
    
    // Try to get user's location in the background
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Error getting user location:', error);
        }
      );
    }
  }, []);

  // Handle event selection from map or event list
  const handleEventSelect = (event: CrisisEvent) => {
    setSelectedEvent(event);
    toast.info(`Selected: ${event.title}`);
  };
  
  // Handle submitting a new crisis report
  const handleReportSubmit = (reportData: any) => {
    console.log('Submitted report:', reportData);
    
    // In a real app, this would be sent to an API
    // For demo purposes, we'll create a mock event and add it to our list
    const newEvent: CrisisEvent = {
      id: `temp-${Date.now()}`, // In a real app, the server would generate an ID
      title: reportData.title,
      description: reportData.description,
      type: reportData.type,
      severity: reportData.severity,
      location: reportData.location,
      timestamp: new Date(),
      source: 'User Report',
      verified: false,
      affectedPopulation: undefined,
      resourceNeeds: undefined
    };
    
    setEvents(prev => [newEvent, ...prev]);
    setSelectedEvent(newEvent);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-crisis-slate">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-crisis-red" />
          <h2 className="text-xl font-bold">Loading Crisis Data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Navbar activeItem={activeNavItem} setActiveItem={setActiveNavItem} />
      
      <main className="flex-1 grid grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left sidebar - Events panel */}
        <div className="col-span-1 h-full overflow-hidden flex flex-col">
          <EventsPanel
            events={events}
            onEventSelect={handleEventSelect}
            isLoading={loading}
          />
        </div>
        
        {/* Main content - Map view and tabs */}
        <div className="col-span-2 h-full flex flex-col overflow-hidden">
          <div className="flex-grow crisis-panel">
            <MapView 
              events={events} 
              selectedEvent={selectedEvent} 
              onEventSelect={handleEventSelect} 
              onReportIncident={() => setReportModalOpen(true)}
            />
          </div>
          
          <div className="h-72 mt-4 crisis-panel">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources Needed</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="m-0">
                <OverviewPanel events={events} />
              </TabsContent>
              
              <TabsContent value="resources" className="m-0">
                <ResourcesNeededPanel events={events} />
              </TabsContent>
              
              <TabsContent value="predictions" className="m-0">
                <PredictivePanel activeEvent={selectedEvent} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right sidebar - Details panel */}
        <div className="col-span-1 h-full overflow-hidden">
          {selectedEvent ? (
            <div className="crisis-panel h-full">
              <h2 className="text-lg font-semibold mb-4">{selectedEvent.title}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Details</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span> {selectedEvent.type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Severity:</span> {selectedEvent.severity}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span> {selectedEvent.location.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Source:</span> {selectedEvent.source}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verified:</span> {selectedEvent.verified ? 'Yes' : 'No'}
                    </div>
                    {selectedEvent.affectedPopulation && (
                      <div>
                        <span className="text-muted-foreground">Affected:</span> {selectedEvent.affectedPopulation.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedEvent.resourceNeeds && selectedEvent.resourceNeeds.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Resource Needs</h3>
                    <div className="space-y-2">
                      {selectedEvent.resourceNeeds.map((need, index) => (
                        <div key={index} className="p-2 border rounded text-sm">
                          <div className="font-medium">{need.type}</div>
                          <div className="text-muted-foreground">{need.description}</div>
                          <div className="text-xs mt-1">
                            <span className={`px-1.5 py-0.5 rounded ${
                              need.urgency === 'critical' ? 'bg-crisis-red/20 text-crisis-red' :
                              need.urgency === 'high' ? 'bg-orange-600/20 text-orange-500' :
                              'bg-yellow-600/20 text-yellow-500'
                            }`}>
                              {need.urgency} urgency
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      className="p-2 text-sm rounded bg-crisis-blue hover:bg-crisis-blue/80 text-white transition-colors"
                      onClick={() => toast.info("Resource allocation interface not yet implemented")}
                    >
                      Resource Allocation
                    </button>
                    <button 
                      className="p-2 text-sm rounded bg-crisis-red hover:bg-crisis-red/80 text-white transition-colors"
                      onClick={() => toast.info("Alert sent to response teams")}
                    >
                      Alert Teams
                    </button>
                    <button 
                      className="p-2 text-sm rounded border border-border hover:bg-muted/50 transition-colors"
                      onClick={() => toast.info("Note feature not yet implemented")}
                    >
                      Add Note
                    </button>
                    <button 
                      className="p-2 text-sm rounded border border-border hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        // Simulate sharing data with a toast
                        navigator.clipboard.writeText(
                          `Crisis Alert: ${selectedEvent.title} - ${selectedEvent.severity} ${selectedEvent.type} at ${selectedEvent.location.name}`
                        );
                        toast.success("Event details copied to clipboard");
                      }}
                    >
                      Share Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="crisis-panel h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Select an event to view details</p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Crisis Report Modal */}
      <CrisisReportModal 
        open={reportModalOpen} 
        onOpenChange={setReportModalOpen}
        onSubmit={handleReportSubmit}
        currentLocation={userLocation}
      />
    </div>
  );
};

export default Index;
