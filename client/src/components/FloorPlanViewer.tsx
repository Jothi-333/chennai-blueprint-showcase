/**
 * Interactive Floor Plan Viewer Component
 * Features: Zoom, Pan, Touch gestures, Mouse controls
 * Design: Bauhaus Modernism meets Indian Contemporary
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  X,
  Move
} from "lucide-react";

interface FloorPlanViewerProps {
  floorPlan: {
    image: string;
    title: string;
    subtitle: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FloorPlanViewer({
  floorPlan,
  isOpen,
  onClose
}: FloorPlanViewerProps) {
  if (!isOpen || !floorPlan) return null;

  const { image, title, subtitle } = floorPlan;
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

  // Pan controls - Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Pan controls - Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="relative w-full max-w-7xl h-[90vh] bg-card border-primary/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
          <div>
            <h3 className="text-2xl font-display font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground font-mono mt-1">{subtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 p-4 border-b border-border bg-card/30">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="border-primary/30 hover:bg-primary/10"
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="border-primary/30 hover:bg-primary/10"
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-primary/30 hover:bg-primary/10"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Move className="h-4 w-4" />
            <span className="font-mono">{Math.round(scale * 100)}%</span>
          </div>
        </div>

        {/* Viewer */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-muted/20 relative cursor-move"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              ref={imageRef}
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain transition-transform select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
              }}
              draggable={false}
            />
          </div>

          {/* Hint overlay */}
          {scale === 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm">
              Scroll to zoom • Click and drag to pan
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-border bg-card/50 text-xs text-muted-foreground text-center">
          Use mouse wheel or zoom buttons to zoom • Click and drag to pan when zoomed in
        </div>
      </Card>
    </div>
  );
}
