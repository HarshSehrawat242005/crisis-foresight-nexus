
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CrisisEvent, CrisisType, SeverityLevel } from '@/services/crisisData';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OverviewPanelProps {
  events: CrisisEvent[];
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ events }) => {
  // Calculate statistics
  const totalEvents = events.length;
  const totalCritical = events.filter(e => e.severity === 'critical').length;
  const criticalPercentage = (totalCritical / totalEvents) * 100;
  
  const totalVerified = events.filter(e => e.verified).length;
  const verifiedPercentage = (totalVerified / totalEvents) * 100;
  
  const totalWithResourceNeeds = events.filter(e => e.resourceNeeds && e.resourceNeeds.length > 0).length;
  const resourceNeedsPercentage = (totalWithResourceNeeds / totalEvents) * 100;
  
  // Calculate by type
  const typeCount: Record<CrisisType, number> = {
    earthquake: 0,
    flood: 0,
    wildfire: 0,
    hurricane: 0,
    tornado: 0,
    landslide: 0,
    powerOutage: 0,
    infrastructure: 0,
    medical: 0
  };
  
  events.forEach(event => {
    typeCount[event.type]++;
  });
  
  // Calculate by severity
  const severityCount: Record<SeverityLevel, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };
  
  events.forEach(event => {
    severityCount[event.severity]++;
  });
  
  // Prepare chart data
  const typeData = Object.entries(typeCount)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count
    }));
  
  const severityData = Object.entries(severityCount)
    .map(([severity, count]) => ({
      name: severity.charAt(0).toUpperCase() + severity.slice(1),
      count
    }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Events</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalCritical} <span className="text-sm font-normal text-muted-foreground">/ {totalEvents}</span></div>
            <Progress value={criticalPercentage} className="h-2 mt-2" indicatorClassName="bg-crisis-red" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalVerified} <span className="text-sm font-normal text-muted-foreground">/ {totalEvents}</span></div>
            <Progress value={verifiedPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resource Needs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalWithResourceNeeds} <span className="text-sm font-normal text-muted-foreground">/ {totalEvents}</span></div>
            <Progress value={resourceNeedsPercentage} className="h-2 mt-2" indicatorClassName="bg-crisis-amber" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">By Type</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#123E59', 
                    borderColor: '#2d4a5e',
                    borderRadius: '0.375rem'
                  }} 
                />
                <Bar dataKey="count" fill="#FFA400" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">By Severity</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#123E59', 
                    borderColor: '#2d4a5e',
                    borderRadius: '0.375rem'
                  }} 
                />
                <Bar dataKey="count" fill="#D92525" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPanel;
