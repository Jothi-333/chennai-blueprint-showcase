/**
 * Vector Floor Plan Editor
 * Interactive SVG-based floor plan with editable rooms, doors, and dimensions
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Edit3, Save, Undo } from 'lucide-react';
import type { FloorPlan, Room, Door } from '@/data/floorPlanData';

interface VectorFloorPlanEditorProps {
  floorPlan: FloorPlan;
  title: string;
}

export default function VectorFloorPlanEditor({ floorPlan, title }: VectorFloorPlanEditorProps) {
  const [rooms, setRooms] = useState<Room[]>(floorPlan.rooms);
  const [doors, setDoors] = useState<Door[]>(floorPlan.doors);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState<Room[][]>([floorPlan.rooms]);
  const svgRef = useRef<SVGSVGElement>(null);

  const scale = 20; // pixels per foot
  const viewBoxWidth = floorPlan.totalWidth * scale;
  const viewBoxHeight = floorPlan.totalHeight * scale;

  const handleRoomClick = (roomId: string) => {
    if (isEditing) {
      setSelectedRoom(roomId === selectedRoom ? null : roomId);
    }
  };

  const handleRoomResize = (roomId: string, newWidth: number, newHeight: number) => {
    const newRooms = rooms.map(room =>
      room.id === roomId ? { ...room, width: newWidth, height: newHeight } : room
    );
    setHistory([...history, rooms]);
    setRooms(newRooms);
  };

  const handleRoomMove = (roomId: string, newX: number, newY: number) => {
    const newRooms = rooms.map(room =>
      room.id === roomId ? { ...room, x: newX, y: newY } : room
    );
    setHistory([...history, rooms]);
    setRooms(newRooms);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setRooms(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-floor-plan.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = viewBoxWidth * 2;
    canvas.height = viewBoxHeight * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-floor-plan.png`;
          link.click();
          URL.revokeObjectURL(pngUrl);
        }
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title} - Vector Editor</h3>
        <div className="flex gap-2">
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Editing' : 'Edit Mode'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={history.length <= 1}
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSVG}
          >
            <Download className="w-4 h-4 mr-2" />
            SVG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPNG}
          >
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="mb-4 p-3 bg-primary/10 rounded text-sm">
          <p className="font-medium mb-1">Edit Mode Active</p>
          <p className="text-muted-foreground">
            Click on any room to select it. Selected rooms will show resize handles.
            {selectedRoom && ' Drag the corners to resize the room.'}
          </p>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-auto bg-white">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto"
          style={{ minHeight: '600px' }}
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
              <path
                d={`M ${scale} 0 L 0 0 0 ${scale}`}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#grid)" />

          {/* Rooms */}
          {rooms.map((room) => {
            const isSelected = selectedRoom === room.id;
            return (
              <g key={room.id}>
                {/* Room rectangle */}
                <rect
                  x={room.x * scale}
                  y={room.y * scale}
                  width={room.width * scale}
                  height={room.height * scale}
                  fill={room.color}
                  stroke={isSelected ? '#ff6b35' : '#333'}
                  strokeWidth={isSelected ? 3 : 2}
                  opacity={0.8}
                  onClick={() => handleRoomClick(room.id)}
                  style={{ cursor: isEditing ? 'pointer' : 'default' }}
                />
                
                {/* Room label */}
                <text
                  x={room.x * scale + (room.width * scale) / 2}
                  y={room.y * scale + (room.height * scale) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#333"
                  fontSize="14"
                  fontWeight="600"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {room.label?.split('\n').map((line, i) => (
                    <tspan key={i} x={room.x * scale + (room.width * scale) / 2} dy={i === 0 ? 0 : 18}>
                      {line}
                    </tspan>
                  ))}
                </text>

                {/* Resize handles when selected */}
                {isSelected && isEditing && (
                  <>
                    <circle
                      cx={(room.x + room.width) * scale}
                      cy={(room.y + room.height) * scale}
                      r="6"
                      fill="#ff6b35"
                      stroke="white"
                      strokeWidth="2"
                      style={{ cursor: 'nwse-resize' }}
                    />
                  </>
                )}
              </g>
            );
          })}

          {/* Doors */}
          {doors.map((door) => (
            <g key={door.id}>
              <rect
                x={door.x * scale}
                y={door.y * scale}
                width={door.width * scale}
                height={scale * 0.3}
                fill="#8B4513"
                stroke="#333"
                strokeWidth="1"
                transform={`rotate(${door.rotation}, ${door.x * scale + (door.width * scale) / 2}, ${door.y * scale + (scale * 0.15)})`}
              />
              <text
                x={door.x * scale + (door.width * scale) / 2}
                y={door.y * scale - 5}
                textAnchor="middle"
                fill="#333"
                fontSize="10"
                fontWeight="500"
              >
                {door.type}
              </text>
            </g>
          ))}

          {/* Dimensions */}
          <text x={viewBoxWidth / 2} y={20} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
            {floorPlan.totalWidth}'-0" x {floorPlan.totalHeight}'-0"
          </text>

          {/* North arrow */}
          <g transform={`translate(${viewBoxWidth - 60}, 60)`}>
            <polygon points="0,-30 -10,10 10,10" fill="#333" />
            <text x="0" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">N</text>
          </g>
        </svg>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Scale: 1:50 | Total Area: {floorPlan.totalWidth * floorPlan.totalHeight} sq ft</p>
      </div>
    </Card>
  );
}
