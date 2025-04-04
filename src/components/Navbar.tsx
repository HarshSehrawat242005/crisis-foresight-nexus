
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Users, 
  Truck,
  BarChart3 
} from 'lucide-react';

interface NavbarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem, setActiveItem }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'resources', label: 'Resources', icon: Truck },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <nav className="flex px-4 py-2 border-b border-border/30">
      <div className="flex space-x-1">
        {navItems.map(item => (
          <Button
            key={item.id}
            variant={activeItem === item.id ? 'default' : 'ghost'}
            className={`flex items-center gap-2 ${activeItem === item.id ? 'bg-crisis-blue text-white' : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
