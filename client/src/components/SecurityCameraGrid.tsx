import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Camera, 
  Maximize2, 
  Circle, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Video,
  VideoOff,
  Download,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  motionDetected: boolean;
  lastMotion?: string;
  thumbnail: string;
  resolution: string;
  fps: number;
}

export default function SecurityCameraGrid() {
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock camera feeds (will be replaced with real RTSP/WebRTC streams)
  const cameras: CameraFeed[] = [
    {
      id: 'cam-1',
      name: 'Front Entrance',
      location: 'Ground Floor - Main Door',
      status: 'recording',
      motionDetected: true,
      lastMotion: '2 min ago',
      thumbnail: '/api/placeholder/400/300',
      resolution: '1080p',
      fps: 30
    },
    {
      id: 'cam-2',
      name: 'Parking Area',
      location: 'Ground Floor - Parking',
      status: 'recording',
      motionDetected: false,
      thumbnail: '/api/placeholder/400/300',
      resolution: '1080p',
      fps: 30
    },
    {
      id: 'cam-3',
      name: 'Backyard',
      location: 'Ground Floor - Rear',
      status: 'online',
      motionDetected: false,
      thumbnail: '/api/placeholder/400/300',
      resolution: '720p',
      fps: 25
    },
    {
      id: 'cam-4',
      name: 'Terrace',
      location: 'Terrace - Overview',
      status: 'recording',
      motionDetected: true,
      lastMotion: '5 min ago',
      thumbnail: '/api/placeholder/400/300',
      resolution: '1080p',
      fps: 30
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording': return 'bg-red-500';
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recording':
        return <Badge variant="destructive" className="gap-1"><Circle className="h-2 w-2 fill-current animate-pulse" />Recording</Badge>;
      case 'online':
        return <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 border-green-500/30"><CheckCircle2 className="h-3 w-3" />Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="gap-1 bg-gray-500/10 text-gray-600 border-gray-500/30"><VideoOff className="h-3 w-3" />Offline</Badge>;
      default:
        return null;
    }
  };

  const activeCameras = cameras.filter(cam => cam.status !== 'offline').length;
  const motionDetections = cameras.filter(cam => cam.motionDetected).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Cameras</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{cameras.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCameras}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Circle className="h-5 w-5 text-red-600 dark:text-red-400 fill-current animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recording</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {cameras.filter(cam => cam.status === 'recording').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Motion Detected</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{motionDetections}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    {camera.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{camera.location}</p>
                </div>
                {getStatusBadge(camera.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Camera Feed Preview */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer"
                   onClick={() => {
                     setSelectedCamera(camera);
                     setIsFullscreen(true);
                   }}>
                {/* Simulated camera feed with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                  {/* Grid overlay for camera effect */}
                  <div className="absolute inset-0 opacity-10"
                       style={{
                         backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                         backgroundSize: '20px 20px'
                       }}>
                  </div>
                  
                  {/* Camera info overlay */}
                  <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)} animate-pulse`}></div>
                      <span className="text-xs text-white font-mono">{camera.resolution} • {camera.fps}fps</span>
                    </div>
                    {camera.motionDetected && (
                      <Badge variant="destructive" className="gap-1 animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                        Motion
                      </Badge>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                    <span className="text-xs text-white font-mono">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Expand button on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Maximize2 className="h-5 w-5" />
                      View Fullscreen
                    </Button>
                  </div>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {camera.motionDetected && camera.lastMotion && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <Activity className="h-3 w-3" />
                      <span>Last: {camera.lastMotion}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fullscreen Camera View Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {selectedCamera?.name}
              <span className="text-sm text-muted-foreground font-normal">
                • {selectedCamera?.location}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 relative">
            {/* Fullscreen camera feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10"
                   style={{
                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                     backgroundSize: '30px 30px'
                   }}>
              </div>
              
              {/* Camera info */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedCamera?.status || 'offline')} animate-pulse`}></div>
                    <span className="text-sm text-white font-mono">
                      {selectedCamera?.resolution} • {selectedCamera?.fps}fps
                    </span>
                  </div>
                  {selectedCamera?.motionDetected && (
                    <Badge variant="destructive" className="gap-1 animate-pulse">
                      <AlertTriangle className="h-4 w-4" />
                      Motion Detected
                    </Badge>
                  )}
                </div>
                {getStatusBadge(selectedCamera?.status || 'offline')}
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded">
                <span className="text-sm text-white font-mono">
                  {new Date().toLocaleString()}
                </span>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button size="sm" variant="secondary" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button size="sm" variant="secondary" className="gap-2">
                  <Video className="h-4 w-4" />
                  Record
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

