/**
 * Hybrid Floor Plan Editor
 * Upload raster floor plan image, overlay selection tools, and get AI suggestions for specific areas
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, MousePointer2, Download, Sparkles, Check, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface SelectionArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  instruction: string;
  suggestion?: string;
  status: 'pending' | 'processing' | 'suggested' | 'approved' | 'rejected';
}

export default function HybridFloorPlanEditor() {
  const [floorPlanImage, setFloorPlanImage] = useState<string | null>(null);
  const [selections, setSelections] = useState<SelectionArea[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [currentSelection, setCurrentSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSuggestion = trpc.floorPlan.generateSuggestion.useMutation({
    onSuccess: (data: { suggestion: string }, variables: { selectionId: string; instruction: string; area: { x: number; y: number; width: number; height: number } }) => {
      setSelections(prev => prev.map(sel => 
        sel.id === variables.selectionId 
          ? { ...sel, suggestion: data.suggestion, status: 'suggested' }
          : sel
      ));
      toast.success('AI suggestion generated!');
    },
    onError: (error: any) => {
      toast.error(`Failed to generate suggestion: ${error.message}`);
      setSelections(prev => prev.map(sel => 
        sel.status === 'processing' ? { ...sel, status: 'pending' } : sel
      ));
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setFloorPlanImage(imageUrl);
      setSelections([]);
      setSelectedAreaId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSelectionStart({ x, y });
    setCurrentSelection({ x, y, width: 0, height: 0 });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !selectionStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const width = currentX - selectionStart.x;
    const height = currentY - selectionStart.y;

    setCurrentSelection({
      x: width < 0 ? currentX : selectionStart.x,
      y: height < 0 ? currentY : selectionStart.y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleCanvasMouseUp = () => {
    if (!isSelecting || !currentSelection || currentSelection.width < 2 || currentSelection.height < 2) {
      setSelectionStart(null);
      setCurrentSelection(null);
      return;
    }

    const newSelection: SelectionArea = {
      id: `sel-${Date.now()}`,
      x: currentSelection.x,
      y: currentSelection.y,
      width: currentSelection.width,
      height: currentSelection.height,
      instruction: '',
      status: 'pending'
    };

    setSelections(prev => [...prev, newSelection]);
    setSelectedAreaId(newSelection.id);
    setSelectionStart(null);
    setCurrentSelection(null);
    setIsSelecting(false);
  };

  const handleDeleteSelection = (id: string) => {
    setSelections(prev => prev.filter(sel => sel.id !== id));
    if (selectedAreaId === id) {
      setSelectedAreaId(null);
      setInstruction('');
    }
  };

  const handleSaveInstruction = () => {
    if (!selectedAreaId || !instruction.trim()) return;

    setSelections(prev => prev.map(sel =>
      sel.id === selectedAreaId ? { ...sel, instruction: instruction.trim() } : sel
    ));
    toast.success('Instruction saved');
  };

  const handleRequestSuggestion = (selectionId: string) => {
    const selection = selections.find(s => s.id === selectionId);
    if (!selection || !selection.instruction) {
      toast.error('Please add an instruction first');
      return;
    }

    setSelections(prev => prev.map(sel =>
      sel.id === selectionId ? { ...sel, status: 'processing' } : sel
    ));

    generateSuggestion.mutate({
      selectionId,
      instruction: selection.instruction,
      area: {
        x: selection.x,
        y: selection.y,
        width: selection.width,
        height: selection.height
      }
    });
  };

  const handleApprove = (selectionId: string) => {
    setSelections(prev => prev.map(sel =>
      sel.id === selectionId ? { ...sel, status: 'approved' } : sel
    ));
    toast.success('Modification approved');
  };

  const handleReject = (selectionId: string) => {
    setSelections(prev => prev.map(sel =>
      sel.id === selectionId ? { ...sel, status: 'rejected', suggestion: undefined } : sel
    ));
    toast.info('Suggestion rejected');
  };

  const selectedArea = selections.find(s => s.id === selectedAreaId);

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Hybrid Floor Plan Editor</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your floor plan, select areas to modify, and get AI suggestions
          </p>
        </div>
        {floorPlanImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFloorPlanImage(null);
              setSelections([]);
              setSelectedAreaId(null);
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr,350px] gap-6">
        {/* Canvas Area */}
        <div className="space-y-4">
          {!floorPlanImage ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
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
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Floor Plan Image
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supported: PNG, JPG, JPEG (Max 10MB)
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  variant={isSelecting ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsSelecting(!isSelecting)}
                >
                  <MousePointer2 className="w-4 h-4 mr-2" />
                  {isSelecting ? 'Selecting...' : 'Select Area'}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="relative border-2 border-border rounded-lg overflow-hidden bg-muted">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ cursor: isSelecting ? 'crosshair' : 'default', zIndex: 10 }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                <img
                  ref={imageRef}
                  src={floorPlanImage}
                  alt="Floor Plan"
                  className="w-full h-auto"
                  onLoad={() => {
                    const canvas = canvasRef.current;
                    const img = imageRef.current;
                    if (canvas && img) {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      canvas.style.width = '100%';
                      canvas.style.height = 'auto';
                    }
                  }}
                />
                
                {/* Render selections */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 20 }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {selections.map(sel => (
                    <g key={sel.id}>
                      <rect
                        x={sel.x}
                        y={sel.y}
                        width={sel.width}
                        height={sel.height}
                        fill={
                          sel.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' :
                          sel.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' :
                          sel.status === 'suggested' ? 'rgba(59, 130, 246, 0.2)' :
                          'rgba(251, 146, 60, 0.2)'
                        }
                        stroke={
                          sel.id === selectedAreaId ? '#ff6b35' :
                          sel.status === 'approved' ? '#22c55e' :
                          sel.status === 'rejected' ? '#ef4444' :
                          sel.status === 'suggested' ? '#3b82f6' :
                          '#fb923c'
                        }
                        strokeWidth="0.5"
                        strokeDasharray={sel.id === selectedAreaId ? '2 1' : '0'}
                      />
                    </g>
                  ))}
                  
                  {/* Current selection being drawn */}
                  {currentSelection && currentSelection.width > 0 && currentSelection.height > 0 && (
                    <rect
                      x={currentSelection.x}
                      y={currentSelection.y}
                      width={currentSelection.width}
                      height={currentSelection.height}
                      fill="rgba(251, 146, 60, 0.2)"
                      stroke="#fb923c"
                      strokeWidth="0.5"
                      strokeDasharray="2 1"
                    />
                  )}
                </svg>
              </div>
            </>
          )}
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-3">Selected Areas ({selections.length})</h4>
            {selections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Click "Select Area" and drag on the floor plan to mark regions you want to modify
              </p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selections.map(sel => (
                  <div
                    key={sel.id}
                    className={`p-2 rounded border cursor-pointer ${
                      sel.id === selectedAreaId ? 'border-primary bg-primary/10' : 'border-border bg-background'
                    }`}
                    onClick={() => {
                      setSelectedAreaId(sel.id);
                      setInstruction(sel.instruction);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        Area {selections.indexOf(sel) + 1}
                        {sel.status === 'approved' && ' ✓'}
                        {sel.status === 'processing' && ' ⏳'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSelection(sel.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    {sel.instruction && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {sel.instruction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {selectedArea && (
            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Modification Instructions</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="instruction" className="text-sm">
                    What should AI change in this area?
                  </Label>
                  <Textarea
                    id="instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="E.g., Remove door D6 from walk-in wardrobe"
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveInstruction}
                  disabled={!instruction.trim()}
                  className="w-full"
                >
                  Save Instruction
                </Button>

                {selectedArea.instruction && selectedArea.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleRequestSuggestion(selectedArea.id)}
                    disabled={generateSuggestion.isPending}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {generateSuggestion.isPending ? 'Generating...' : 'Get AI Suggestion'}
                  </Button>
                )}

                {selectedArea.status === 'processing' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    Processing...
                  </div>
                )}

                {selectedArea.suggestion && selectedArea.status === 'suggested' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-sm font-medium mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        AI Suggestion
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedArea.suggestion}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(selectedArea.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(selectedArea.id)}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {selectedArea.status === 'approved' && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-sm font-medium flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      Modification Approved
                    </p>
                  </div>
                )}

                {selectedArea.status === 'rejected' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-sm font-medium flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      Suggestion Rejected
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestSuggestion(selectedArea.id)}
                      className="w-full mt-2"
                    >
                      Request New Suggestion
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-4 bg-primary/5">
            <h4 className="font-semibold mb-2 text-sm">How it works</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>1. Upload your floor plan image</li>
              <li>2. Click "Select Area" and drag to mark regions</li>
              <li>3. Describe what you want to change</li>
              <li>4. Get AI suggestions for modifications</li>
              <li>5. Approve or reject each suggestion</li>
              <li>6. Export the final modified plan</li>
            </ul>
          </Card>
        </div>
      </div>
    </Card>
  );
}
