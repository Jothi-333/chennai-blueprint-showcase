import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FloorPlanUploaderProps {
  floorName: string;
  currentImage: string;
  onImageUpdate: (newImageUrl: string) => void;
}

export default function FloorPlanUploader({ floorName, currentImage, onImageUpdate }: FloorPlanUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPreview(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmUpload = () => {
    if (preview) {
      setIsUploading(true);
      // Update the floor plan with the new image
      onImageUpdate(preview);
      setIsUploading(false);
      setPreview(null);
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold mb-4">Upload Custom {floorName} Plan</h3>
      
      {!preview ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload your corrected floor plan from SketchUp or any design software
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button 
              variant="outline" 
              className="cursor-pointer" 
              type="button"
              onClick={handleButtonClick}
            >
              Select Image File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supported: PNG, JPG, JPEG (Max 10MB)
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Current Floor Plan:</h4>
            <img 
              src={currentImage} 
              alt={`Current ${floorName}`}
              className="w-full rounded border border-border"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Preview Your Upload:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelPreview}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <img 
              src={preview} 
              alt="Preview"
              className="w-full rounded border border-border"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleConfirmUpload}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Updating...' : 'Confirm & Update Floor Plan'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelPreview}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
