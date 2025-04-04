
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { CrisisType, SeverityLevel } from '@/services/crisisData';
import { MapPin, Upload, XCircle } from 'lucide-react';

interface CrisisReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (reportData: any) => void;
  currentLocation?: { lat: number; lng: number };
}

const CrisisReportModal: React.FC<CrisisReportModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  currentLocation
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'wildfire' as CrisisType,
    severity: 'medium' as SeverityLevel,
    location: {
      name: '',
      coordinates: currentLocation || { lat: 0, lng: 0 }
    },
    images: [] as File[]
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      toast.info("Detecting your location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { lat: latitude, lng: longitude }
            }
          }));
          toast.success("Location detected successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to detect location. Please enter manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...formData.images, ...newFiles].slice(0, 3); // Limit to 3 images
      
      setFormData(prev => ({
        ...prev,
        images: updatedFiles
      }));
      
      // Create preview URLs
      const newPreviewUrls = updatedFiles.map(file => URL.createObjectURL(file));
      
      // Revoke old preview URLs to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
    
    // Revoke the URL of the removed image
    URL.revokeObjectURL(previewUrls[index]);
    
    const updatedPreviews = [...previewUrls];
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);
  };

  const validateCoordinates = () => {
    const { lat, lng } = formData.location.coordinates;
    
    // Basic coordinate validation
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.");
      return false;
    }
    
    // Check if coordinates are default (0,0) which is in the ocean
    if (lat === 0 && lng === 0 && !formData.location.name) {
      toast.error("Please provide a location name or detect your location.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location.name) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (!validateCoordinates()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate file upload progress
    const uploadTimer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadTimer);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast.success("Crisis report submitted successfully!");
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'wildfire',
        severity: 'medium',
        location: {
          name: '',
          coordinates: currentLocation || { lat: 0, lng: 0 }
        },
        images: []
      });
      
      setPreviewUrls([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      clearInterval(uploadTimer);
      setUploadProgress(0);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Crisis Incident</DialogTitle>
          <DialogDescription>
            Provide details about the emergency situation you're witnessing. This information will be shared with emergency responders.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Incident Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the incident"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Incident Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="wildfire">Wildfire</SelectItem>
                  <SelectItem value="hurricane">Hurricane</SelectItem>
                  <SelectItem value="tornado">Tornado</SelectItem>
                  <SelectItem value="landslide">Landslide</SelectItem>
                  <SelectItem value="powerOutage">Power Outage</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="medical">Medical Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => handleInputChange('severity', value as SeverityLevel)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide details about what you're seeing, how many people are affected, etc."
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="location">Location Name *</Label>
                <Input
                  id="location"
                  placeholder="E.g., Central Park, Manhattan"
                  value={formData.location.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      name: e.target.value
                    }
                  }))}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={handleLocationDetect}
                disabled={isSubmitting}
                title="Detect my location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {formData.location.coordinates.lat !== 0 && (
              <p className="text-xs text-muted-foreground">
                Coordinates: {formData.location.coordinates.lat.toFixed(6)}, {formData.location.coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="images">Add Images (optional)</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isSubmitting || formData.images.length >= 3}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {formData.images.length === 0 ? 'Upload Images' : 'Add More Images'}
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting || formData.images.length >= 3}
              />
            </div>
            
            {previewUrls.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-background rounded-full"
                      disabled={isSubmitting}
                    >
                      <XCircle className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              You can upload up to 3 images. Max 5MB each.
            </p>
          </div>
        </div>
        
        {isSubmitting && (
          <div className="mb-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center mt-1 text-muted-foreground">
              Uploading report... {uploadProgress}%
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-crisis-blue hover:bg-crisis-blue/90"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisReportModal;
