/**
 * Editable Floor Plan Component
 * Full-featured interactive floor plan editor with drag-to-move and resize capabilities
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Edit3, Undo, Redo, Move, Maximize2 } from 'lucide-react';
import type { FloorPlan, Room } from '@/data/floorPlanData';

interface EditableFloorPlanProps {
  initialPlan: FloorPlan;
  title: string;
}

export default function EditableFloorPlan({ initialPlan, title }: EditableFloorPlanProps) {
  const [rooms, setRooms] = useState<Room[]>(initialPlan.rooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState<Room[][]>([initialPlan.rooms]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [dragMode, setDragMode] = useState<'move' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const scale = 18; // pixels per foot
  const viewBoxWidth = initialPlan.totalWidth * scale;
  const viewBoxHeight = initialPlan.totalHeight * scale;

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  const saveToHistory = (newRooms: Room[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newRooms);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setRooms(newRooms);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setRooms(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setRooms(history[historyIndex + 1]);
    }
  };

  const handleRoomClick = (roomId: string, e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    setSelectedRoomId(roomId === selectedRoomId ? null : roomId);
  };

  const handleMouseDown = (roomId: string, mode: 'move' | 'resize', e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    e.preventDefault();
    
    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    setDragMode(mode);
    setDragStart({ x: svgP.x / scale, y: svgP.y / scale });
    setSelectedRoomId(roomId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragMode || !dragStart || !selectedRoomId) return;

    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const currentX = svgP.x / scale;
    const currentY = svgP.y / scale;

    const room = rooms.find(r => r.id === selectedRoomId);
    if (!room) return;

    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    const newRooms = rooms.map(r => {
      if (r.id !== selectedRoomId) return r;

      if (dragMode === 'move') {
        return {
          ...r,
          x: Math.max(0, Math.min(r.x + deltaX, initialPlan.totalWidth - r.width)),
          y: Math.max(0, Math.min(r.y + deltaY, initialPlan.totalHeight - r.height))
        };
      } else if (dragMode === 'resize') {
        const newWidth = Math.max(2, r.width + deltaX);
        const newHeight = Math.max(2, r.height + deltaY);
        return { ...r, width: newWidth, height: newHeight };
      }
      return r;
    });

    setRooms(newRooms);
    setDragStart({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    if (dragMode) {
      saveToHistory(rooms);
      setDragMode(null);
      setDragStart(null);
    }
  };

  const handleRoomPropertyChange = (property: 'width' | 'height' | 'x' | 'y', value: number) => {
    if (!selectedRoomId) return;
    const newRooms = rooms.map(r =>
      r.id === selectedRoomId ? { ...r, [property]: value } : r
    );
    saveToHistory(newRooms);
  };

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-edited.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = viewBoxWidth * 3;
    canvas.height = viewBoxHeight * 3;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-edited.png`;
          link.click();
          URL.revokeObjectURL(pngUrl);
        }
      }, 'image/png');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-semibold">{title} - Editable Vector Plan</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) setSelectedRoomId(null);
            }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Exit Edit' : 'Edit Mode'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex === 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportSVG}>
            <Download className="w-4 h-4 mr-2" />
            SVG
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPNG}>
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr,300px] gap-6">
        {/* SVG Canvas */}
        <div className="border-2 border-border rounded-lg overflow-hidden bg-white">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '500px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid */}
            <defs>
              <pattern id="smallGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width={scale * 5} height={scale * 5} patternUnits="userSpaceOnUse">
                <rect width={scale * 5} height={scale * 5} fill="url(#smallGrid)" />
                <path d={`M ${scale * 5} 0 L 0 0 0 ${scale * 5}`} fill="none" stroke="#e0e0e0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#grid)" />

            {/* Outer boundary */}
            <rect
              x="0"
              y="0"
              width={viewBoxWidth}
              height={viewBoxHeight}
              fill="none"
              stroke="#000"
              strokeWidth="4"
            />

            {/* Rooms */}
            {rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              return (
                <g key={room.id}>
                  <rect
                    x={room.x * scale}
                    y={room.y * scale}
                    width={room.width * scale}
                    height={room.height * scale}
                    fill={room.color}
                    stroke={isSelected ? '#ff6b35' : '#333'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={0.75}
                    onClick={(e) => handleRoomClick(room.id, e)}
                    onMouseDown={(e) => handleMouseDown(room.id, 'move', e)}
                    style={{ cursor: isEditing ? (isSelected ? 'move' : 'pointer') : 'default' }}
                  />
                  
                  <text
                    x={room.x * scale + (room.width * scale) / 2}
                    y={room.y * scale + (room.height * scale) / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1a1a1a"
                    fontSize="13"
                    fontWeight="600"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {room.label?.split('\n').map((line, i) => (
                      <tspan key={i} x={room.x * scale + (room.width * scale) / 2} dy={i === 0 ? -8 : 16}>
                        {line}
                      </tspan>
                    ))}
                  </text>

                  {isSelected && isEditing && (
                    <>
                      {/* Move handle (center) */}
                      <circle
                        cx={room.x * scale + (room.width * scale) / 2}
                        cy={room.y * scale + (room.height * scale) / 2}
                        r="8"
                        fill="#4CAF50"
                        stroke="white"
                        strokeWidth="2"
                        onMouseDown={(e) => handleMouseDown(room.id, 'move', e)}
                        style={{ cursor: 'move' }}
                      />
                      <Move
                        x={room.x * scale + (room.width * scale) / 2 - 6}
                        y={room.y * scale + (room.height * scale) / 2 - 6}
                        width="12"
                        height="12"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        style={{ pointerEvents: 'none' }}
                      />
                      
                      {/* Resize handle (bottom-right) */}
                      <circle
                        cx={(room.x + room.width) * scale}
                        cy={(room.y + room.height) * scale}
                        r="8"
                        fill="#ff6b35"
                        stroke="white"
                        strokeWidth="2"
                        onMouseDown={(e) => handleMouseDown(room.id, 'resize', e)}
                        style={{ cursor: 'nwse-resize' }}
                      />
                      <Maximize2
                        x={(room.x + room.width) * scale - 6}
                        y={(room.y + room.height) * scale - 6}
                        width="12"
                        height="12"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        style={{ pointerEvents: 'none' }}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* Dimensions */}
            <text x={viewBoxWidth / 2} y={25} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">
              {initialPlan.totalWidth}' × {initialPlan.totalHeight}'
            </text>

            {/* North arrow */}
            <g transform={`translate(${viewBoxWidth - 50}, 50)`}>
              <polygon points="0,-25 -8,8 8,8" fill="#000" />
              <text x="0" y="25" textAnchor="middle" fontSize="16" fontWeight="bold">N</text>
            </g>
          </svg>
        </div>

        {/* Properties Panel */}
        <div className="space-y-4">
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-3">Room Properties</h4>
            {selectedRoom ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">{selectedRoom.name}</Label>
                  <p className="text-xs text-muted-foreground mt-1">ID: {selectedRoom.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="room-x" className="text-xs">X Position (ft)</Label>
                    <Input
                      id="room-x"
                      type="number"
                      value={selectedRoom.x.toFixed(2)}
                      onChange={(e) => handleRoomPropertyChange('x', parseFloat(e.target.value))}
                      step="0.5"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-y" className="text-xs">Y Position (ft)</Label>
                    <Input
                      id="room-y"
                      type="number"
                      value={selectedRoom.y.toFixed(2)}
                      onChange={(e) => handleRoomPropertyChange('y', parseFloat(e.target.value))}
                      step="0.5"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-width" className="text-xs">Width (ft)</Label>
                    <Input
                      id="room-width"
                      type="number"
                      value={selectedRoom.width.toFixed(2)}
                      onChange={(e) => handleRoomPropertyChange('width', parseFloat(e.target.value))}
                      step="0.5"
                      min="2"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-height" className="text-xs">Height (ft)</Label>
                    <Input
                      id="room-height"
                      type="number"
                      value={selectedRoom.height.toFixed(2)}
                      onChange={(e) => handleRoomPropertyChange('height', parseFloat(e.target.value))}
                      step="0.5"
                      min="2"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium">Area: {(selectedRoom.width * selectedRoom.height).toFixed(1)} sq ft</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isEditing ? 'Click on a room to edit its properties' : 'Enable Edit Mode to modify rooms'}
              </p>
            )}
          </Card>

          <Card className="p-4 bg-primary/5">
            <h4 className="font-semibold mb-2 text-sm">Instructions</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Click <strong>Edit Mode</strong> to start editing</li>
              <li>• Click any room to select it</li>
              <li>• Drag the <span className="text-green-600">green handle</span> to move</li>
              <li>• Drag the <span className="text-orange-600">orange handle</span> to resize</li>
              <li>• Use input fields for precise adjustments</li>
              <li>• Export as SVG or PNG when done</li>
            </ul>
          </Card>
        </div>
      </div>
    </Card>
  );
}
