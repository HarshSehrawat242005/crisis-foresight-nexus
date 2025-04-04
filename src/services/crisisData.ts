
// Types for our crisis data
export type CrisisType = 
  | 'earthquake' 
  | 'flood' 
  | 'wildfire' 
  | 'hurricane' 
  | 'tornado' 
  | 'landslide'
  | 'powerOutage'
  | 'infrastructure'
  | 'medical';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  type: CrisisType;
  severity: SeverityLevel;
  location: {
    name: string;
    coordinates: GeoPoint;
  };
  timestamp: Date;
  source: string;
  verified: boolean;
  affectedPopulation?: number;
  resourceNeeds?: {
    type: string;
    description: string;
    urgency: SeverityLevel;
  }[];
}

// Helper function to get color for crisis type
export function getCrisisTypeColor(type: CrisisType): string {
  switch (type) {
    case 'earthquake':
      return '#d92525'; // Red
    case 'flood':
      return '#0f7ac2'; // Blue
    case 'wildfire':
      return '#ff7000'; // Orange
    case 'hurricane':
      return '#7e22ce'; // Purple
    case 'tornado':
      return '#36a2eb'; // Light Blue
    case 'landslide':
      return '#8b4513'; // Brown
    case 'powerOutage':
      return '#f1c232'; // Yellow
    case 'infrastructure':
      return '#6b7280'; // Gray
    case 'medical':
      return '#06b6d4'; // Cyan
    default:
      return '#6b7280'; // Default gray
  }
}

// Helper function to get icon for crisis type
export function getCrisisTypeIcon(type: CrisisType): string {
  switch (type) {
    case 'earthquake':
      return 'alert-triangle';
    case 'flood':
      return 'droplet';
    case 'wildfire':
      return 'flame';
    case 'hurricane':
      return 'wind';
    case 'tornado':
      return 'cloud-rain';
    case 'landslide':
      return 'mountain';
    case 'powerOutage':
      return 'zap-off';
    case 'infrastructure':
      return 'building-2';
    case 'medical':
      return 'heart-pulse';
    default:
      return 'alert-circle';
  }
}

// Helper function to get color based on severity
export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical':
      return '#ef4444'; // Red
    case 'high':
      return '#f97316'; // Orange
    case 'medium':
      return '#facc15'; // Yellow
    case 'low':
      return '#22c55e'; // Green
    default:
      return '#6b7280'; // Gray
  }
}

// Mock crisis events (focused on a California wildfire scenario)
export const mockCrisisEvents: CrisisEvent[] = [
  {
    id: '1',
    title: 'Paradise Wildfire Outbreak',
    description: 'Major wildfire spreading rapidly near Paradise, CA. Evacuation orders in place for northern sectors.',
    type: 'wildfire',
    severity: 'critical',
    location: {
      name: 'Paradise, California',
      coordinates: { lat: 39.7596, lng: -121.6219 }
    },
    timestamp: new Date(2025, 3, 3, 14, 30),
    source: 'CAL FIRE',
    verified: true,
    affectedPopulation: 26218,
    resourceNeeds: [
      {
        type: 'evacuation',
        description: 'Emergency evacuation transportation needed for elderly residents',
        urgency: 'critical'
      },
      {
        type: 'firefighting',
        description: 'Additional water tankers requested for northern perimeter',
        urgency: 'high'
      }
    ]
  },
  {
    id: '2',
    title: 'Chico Hospital Generator Failure',
    description: 'Backup generators at Chico Medical Center failing. Critical patients at risk.',
    type: 'powerOutage',
    severity: 'high',
    location: {
      name: 'Chico, California',
      coordinates: { lat: 39.7284, lng: -121.8375 }
    },
    timestamp: new Date(2025, 3, 3, 16, 45),
    source: 'Butte County Emergency Services',
    verified: true,
    resourceNeeds: [
      {
        type: 'power',
        description: 'Mobile generators needed for ICU and life support systems',
        urgency: 'critical'
      }
    ]
  },
  {
    id: '3',
    title: 'Highway 99 Bridge Structural Damage',
    description: 'Highway 99 bridge showing signs of structural weakness. Traffic diverted.',
    type: 'infrastructure',
    severity: 'medium',
    location: {
      name: 'Gridley, California',
      coordinates: { lat: 39.3635, lng: -121.6930 }
    },
    timestamp: new Date(2025, 3, 3, 15, 20),
    source: 'Caltrans',
    verified: true
  },
  {
    id: '4',
    title: 'Oroville Dam Monitoring Alert',
    description: 'Increased water pressure on Oroville Dam following upstream water surge. Monitoring teams deployed.',
    type: 'flood',
    severity: 'medium',
    location: {
      name: 'Oroville, California',
      coordinates: { lat: 39.5138, lng: -121.5563 }
    },
    timestamp: new Date(2025, 3, 3, 17, 10),
    source: 'Dept of Water Resources',
    verified: true,
    affectedPopulation: 15546
  },
  {
    id: '5',
    title: 'Wildfire Front Approaching Berry Creek',
    description: 'Fire moving east toward Berry Creek community. Containment at 5%.',
    type: 'wildfire',
    severity: 'high',
    location: {
      name: 'Berry Creek, California',
      coordinates: { lat: 39.6493, lng: -121.4044 }
    },
    timestamp: new Date(2025, 3, 3, 18, 30),
    source: 'Fire Incident Command',
    verified: true,
    affectedPopulation: 1200,
    resourceNeeds: [
      {
        type: 'evacuation',
        description: 'Immediate evacuation orders needed',
        urgency: 'critical'
      }
    ]
  },
  {
    id: '6',
    title: 'Medical Supply Shortage',
    description: 'Evacuation center at Chico State reporting critical shortage of medical supplies',
    type: 'medical',
    severity: 'high',
    location: {
      name: 'Chico State University, California',
      coordinates: { lat: 39.7301, lng: -121.8474 }
    },
    timestamp: new Date(2025, 3, 3, 19, 15),
    source: 'Red Cross',
    verified: true,
    resourceNeeds: [
      {
        type: 'medical',
        description: 'Burn treatment supplies, respirators, and first aid kits needed',
        urgency: 'high'
      }
    ]
  },
  {
    id: '7',
    title: 'Smoke Affecting Air Quality',
    description: 'Dangerous air quality levels reported across Butte County. AQI exceeding 300 in multiple locations.',
    type: 'medical',
    severity: 'medium',
    location: {
      name: 'Butte County, California',
      coordinates: { lat: 39.6254, lng: -121.5300 }
    },
    timestamp: new Date(2025, 3, 3, 20, 0),
    source: 'EPA Monitoring',
    verified: true,
    affectedPopulation: 217769
  },
  {
    id: '8',
    title: 'Landslide Risk on Mountain Roads',
    description: 'Fire damage has created landslide risk on Skyway and surrounding mountain roads',
    type: 'landslide',
    severity: 'medium',
    location: {
      name: 'Skyway Road, California',
      coordinates: { lat: 39.7162, lng: -121.7085 }
    },
    timestamp: new Date(2025, 3, 3, 17, 40),
    source: 'Butte County Roads Dept',
    verified: true
  },
  {
    id: '9',
    title: 'Trapped Residents Reported',
    description: 'Social media reports of 30+ residents trapped in Feather Falls area without evacuation route',
    type: 'wildfire',
    severity: 'critical',
    location: {
      name: 'Feather Falls, California',
      coordinates: { lat: 39.5887, lng: -121.2744 }
    },
    timestamp: new Date(2025, 3, 3, 21, 10),
    source: 'Social Media Reports',
    verified: false,
    affectedPopulation: 30,
    resourceNeeds: [
      {
        type: 'rescue',
        description: 'Air rescue capabilities needed immediately',
        urgency: 'critical'
      }
    ]
  },
  {
    id: '10',
    title: 'Cellular Network Outage',
    description: 'Cell towers down in eastern county, hampering communication with evacuation zones',
    type: 'infrastructure',
    severity: 'high',
    location: {
      name: 'Lake Oroville, California',
      coordinates: { lat: 39.5405, lng: -121.4315 }
    },
    timestamp: new Date(2025, 3, 3, 18, 50),
    source: 'Verizon Emergency Response',
    verified: true
  }
];

// Function to get mock crisis events
export function getCrisisEvents(): Promise<CrisisEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCrisisEvents);
    }, 500);
  });
}

// Function to get a specific crisis event by ID
export function getCrisisEventById(id: string): Promise<CrisisEvent | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCrisisEvents.find(event => event.id === id));
    }, 300);
  });
}

// Function to get filtered events
export function getFilteredEvents(
  types?: CrisisType[],
  severities?: SeverityLevel[],
  verified?: boolean
): Promise<CrisisEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockCrisisEvents];
      
      if (types && types.length > 0) {
        filtered = filtered.filter(event => types.includes(event.type));
      }
      
      if (severities && severities.length > 0) {
        filtered = filtered.filter(event => severities.includes(event.severity));
      }
      
      if (verified !== undefined) {
        filtered = filtered.filter(event => event.verified === verified);
      }
      
      resolve(filtered);
    }, 500);
  });
}
