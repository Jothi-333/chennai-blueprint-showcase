import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Zap,
  Droplet,
  Wind,
  Sun,
  Moon,
  Power,
  Activity,
  MessageSquare,
  Settings,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Layers,
  CloudRain
} from "lucide-react";
import { useState } from "react";
import SarojaAIChat from "@/components/SarojaAIChat";
import SecurityCameraGrid from "@/components/SecurityCameraGrid";
import EnergyAnalyticsDashboard from "@/components/EnergyAnalyticsDashboard";
import AutomationRulesManager from "@/components/AutomationRulesManager";
import SarojaFamilyChat from "@/components/SarojaFamilyChat";
import { toast } from "sonner";

export default function SmartHome() {
  const [selectedFloor, setSelectedFloor] = useState("ground");
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Mock device states (will be replaced with real data from Home Assistant)
  const [devices, setDevices] = useState({
    ground: {
      lights: { entrance: true, parking: false, staircase: true },
      security: { mainDoor: true, cameras: 4, motion: 2 },
      power: { consumption: 2.3 }
    },
    floor1: {
      lights: { living: true, bedroom1: false, bedroom2: true, kitchen: true },
      climate: { living: 24, bedroom1: 25, bedroom2: 23 },
      power: { consumption: 4.5 }
    },
    floor2: {
      lights: { living: false, bedroom1: true, bedroom2: false, kitchen: false },
      climate: { living: 26, bedroom1: 24, bedroom2: 25 },
      power: { consumption: 3.2 }
    },
    terrace: {
      lights: { outdoor: false, bbq: false },
      water: { tankLevel: 75, pump: false },
      solar: { production: 3.8, battery: 85 },
      weather: { temp: 32, humidity: 65 }
    }
  });

  const totalPowerConsumption = 
    devices.ground.power.consumption + 
    devices.floor1.power.consumption + 
    devices.floor2.power.consumption;

  const toggleLight = (floor: string, room: string) => {
    setDevices(prev => ({
      ...prev,
      [floor]: {
        ...prev[floor as keyof typeof prev],
        lights: {
          ...prev[floor as keyof typeof prev].lights,
          [room]: !prev[floor as keyof typeof prev].lights[room as keyof typeof prev[typeof floor]['lights']]
        }
      }
    }));
  };

  // Handle AI commands
  const handleAICommand = (command: string) => {
    if (command === 'lights_on') {
      // Turn on all lights
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: true, parking: true, staircase: true } },
        floor1: { ...prev.floor1, lights: { living: true, bedroom1: true, bedroom2: true, kitchen: true } },
        floor2: { ...prev.floor2, lights: { living: true, bedroom1: true, bedroom2: true, kitchen: true } },
        terrace: { ...prev.terrace, lights: { outdoor: true, bbq: true } }
      }));
      toast.success("All lights turned on");
    } else if (command === 'lights_off') {
      // Turn off all lights
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: false, parking: false, staircase: false } },
        floor1: { ...prev.floor1, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false } },
        floor2: { ...prev.floor2, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false } },
        terrace: { ...prev.terrace, lights: { outdoor: false, bbq: false } }
      }));
      toast.success("All lights turned off");
    } else if (command.startsWith('set_temp_')) {
      const temp = parseInt(command.split('_')[2]);
      setDevices(prev => ({
        ...prev,
        floor1: { ...prev.floor1, climate: { living: temp, bedroom1: temp, bedroom2: temp } },
        floor2: { ...prev.floor2, climate: { living: temp, bedroom1: temp, bedroom2: temp } }
      }));
      toast.success(`Temperature set to ${temp}°C`);
    } else if (command === 'ac_on') {
      toast.success("Air conditioning turned on");
    } else if (command === 'ac_off') {
      toast.success("Air conditioning turned off");
    } else if (command === 'lock_doors') {
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, security: { ...prev.ground.security, mainDoor: true } }
      }));
      toast.success("All doors locked");
    } else if (command === 'unlock_door') {
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, security: { ...prev.ground.security, mainDoor: false } }
      }));
      toast.success("Main door unlocked");
    } else if (command === 'scene_movie_time') {
      // Movie Time scene
      setDevices(prev => ({
        ...prev,
        floor1: {
          ...prev.floor1,
          lights: { ...prev.floor1.lights, living: true },
          climate: { ...prev.floor1.climate, living: 24 }
        }
      }));
      toast.success("🎬 Movie Time scene activated!");
    } else if (command === 'scene_goodnight') {
      // Goodnight scene
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: false, parking: false, staircase: false }, security: { ...prev.ground.security, mainDoor: true } },
        floor1: { ...prev.floor1, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false }, climate: { living: 26, bedroom1: 26, bedroom2: 26 } },
        floor2: { ...prev.floor2, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false }, climate: { living: 26, bedroom1: 26, bedroom2: 26 } },
        terrace: { ...prev.terrace, lights: { outdoor: false, bbq: false } }
      }));
      toast.success("🌙 Goodnight scene activated!");
    } else if (command === 'scene_good_morning') {
      // Good Morning scene
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: true, parking: true, staircase: true } },
        floor1: { ...prev.floor1, lights: { living: true, bedroom1: true, bedroom2: true, kitchen: true } },
        floor2: { ...prev.floor2, lights: { living: true, bedroom1: true, bedroom2: true, kitchen: true } }
      }));
      toast.success("☀️ Good Morning scene activated!");
    } else if (command === 'scene_leaving_home') {
      // Leaving Home scene
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: false, parking: false, staircase: false }, security: { ...prev.ground.security, mainDoor: true } },
        floor1: { ...prev.floor1, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false } },
        floor2: { ...prev.floor2, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false } },
        terrace: { ...prev.terrace, lights: { outdoor: false, bbq: false }, water: { ...prev.terrace.water, pump: false } }
      }));
      toast.success("🔒 Leaving Home scene activated!");
    } else if (command === 'scene_coming_home') {
      // Coming Home scene
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: true, parking: true, staircase: true }, security: { ...prev.ground.security, mainDoor: false } },
        floor1: { ...prev.floor1, lights: { living: true, bedroom1: false, bedroom2: false, kitchen: false }, climate: { ...prev.floor1.climate, living: 24 } }
      }));
      toast.success("🏠 Welcome Home scene activated!");
    } else if (command === 'scene_energy_saving') {
      // Energy Saving scene
      setDevices(prev => ({
        ...prev,
        ground: { ...prev.ground, lights: { entrance: false, parking: false, staircase: false } },
        floor1: { ...prev.floor1, lights: { living: true, bedroom1: false, bedroom2: false, kitchen: false }, climate: { living: 26, bedroom1: 26, bedroom2: 26 } },
        floor2: { ...prev.floor2, lights: { living: false, bedroom1: false, bedroom2: false, kitchen: false }, climate: { living: 26, bedroom1: 26, bedroom2: 26 } }
      }));
      toast.success("⚡ Energy Saving scene activated!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-background via-background to-primary/5 border-b">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Home className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono text-primary font-semibold">AI-POWERED SMART HOME</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
                Saroja <span className="text-primary">Smart Home</span>
              </h1>
              <p className="text-muted-foreground">
                AI-controlled home automation system for all floors
              </p>
            </div>
            
            {/* System Status */}
            <div className="hidden md:flex gap-4">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">System Status</p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">Online</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Power Usage</p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {totalPowerConsumption.toFixed(1)} kW
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="container">
          <Tabs value={selectedFloor} onValueChange={setSelectedFloor} className="space-y-6">
            {/* Floor Selector */}
            <TabsList className="grid w-full grid-cols-7 max-w-5xl mx-auto">
              <TabsTrigger value="ground" className="gap-2">
                <Building2 className="h-4 w-4" />
                Ground
              </TabsTrigger>
              <TabsTrigger value="floor1" className="gap-2">
                <Layers className="h-4 w-4" />
                Floor 1
              </TabsTrigger>
              <TabsTrigger value="floor2" className="gap-2">
                <Layers className="h-4 w-4" />
                Floor 2
              </TabsTrigger>
              <TabsTrigger value="terrace" className="gap-2">
                <Sun className="h-4 w-4" />
                Terrace
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Camera className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="energy" className="gap-2">
                <Zap className="h-4 w-4" />
                Energy
              </TabsTrigger>
              <TabsTrigger value="automation" className="gap-2">
                <Settings className="h-4 w-4" />
                Automation
              </TabsTrigger>
            </TabsList>

            {/* Ground Floor Controls */}
            <TabsContent value="ground" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Lighting Control */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Lighting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(devices.ground.lights).map(([room, isOn]) => (
                      <div key={room} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{room}</span>
                        <Button
                          size="sm"
                          variant={isOn ? "default" : "outline"}
                          onClick={() => toggleLight('ground', room)}
                          className={isOn ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          {isOn ? <Power className="h-4 w-4 mr-1" /> : <Power className="h-4 w-4 mr-1" />}
                          {isOn ? "ON" : "OFF"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-green-500" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Main Door</span>
                      <Badge variant={devices.ground.security.mainDoor ? "default" : "destructive"}>
                        {devices.ground.security.mainDoor ? "Locked" : "Unlocked"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cameras Active</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                        {devices.ground.security.cameras}/4
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Motion Detected</span>
                      <Badge variant="outline">
                        {devices.ground.security.motion} zones
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Power Consumption */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      Power Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {devices.ground.power.consumption}
                      </p>
                      <p className="text-sm text-muted-foreground">kW</p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">15% less than yesterday</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Floor 1 Controls */}
            <TabsContent value="floor1" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Lighting Control */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Lighting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(devices.floor1.lights).map(([room, isOn]) => (
                      <div key={room} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Button
                          size="sm"
                          variant={isOn ? "default" : "outline"}
                          onClick={() => toggleLight('floor1', room)}
                          className={isOn ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          {isOn ? "ON" : "OFF"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Climate Control */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      Climate Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(devices.floor1.climate).map(([room, temp]) => (
                      <div key={room} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{temp}°C</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Wind className="h-3 w-3 mr-1" />
                            Cool
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Power className="h-3 w-3 mr-1" />
                            Off
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Power Consumption */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Floor Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Power Usage</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {devices.floor1.power.consumption} kW
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active Devices</p>
                      <p className="text-2xl font-bold">
                        {Object.values(devices.floor1.lights).filter(Boolean).length}/4
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Floor 2 Controls */}
            <TabsContent value="floor2" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Similar structure to Floor 1 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Lighting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(devices.floor2.lights).map(([room, isOn]) => (
                      <div key={room} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Button
                          size="sm"
                          variant={isOn ? "default" : "outline"}
                          onClick={() => toggleLight('floor2', room)}
                          className={isOn ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          {isOn ? "ON" : "OFF"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      Climate Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(devices.floor2.climate).map(([room, temp]) => (
                      <div key={room} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">{room.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{temp}°C</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Wind className="h-3 w-3 mr-1" />
                            Cool
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Power className="h-3 w-3 mr-1" />
                            Off
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Floor Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Power Usage</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {devices.floor2.power.consumption} kW
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active Devices</p>
                      <p className="text-2xl font-bold">
                        {Object.values(devices.floor2.lights).filter(Boolean).length}/4
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Terrace Controls */}
            <TabsContent value="terrace" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Solar Power */}
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      Solar Power
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                        {devices.terrace.solar.production}
                      </p>
                      <p className="text-sm text-muted-foreground">kW Generating</p>
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Battery</p>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${devices.terrace.solar.battery}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{devices.terrace.solar.battery}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Water Management */}
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-blue-500" />
                      Water Tank
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {devices.terrace.water.tankLevel}%
                      </p>
                      <p className="text-sm text-muted-foreground">Tank Level</p>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant={devices.terrace.water.pump ? "default" : "outline"}
                          className="w-full"
                        >
                          <Power className="h-4 w-4 mr-2" />
                          {devices.terrace.water.pump ? "Pump ON" : "Pump OFF"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather */}
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CloudRain className="h-5 w-5 text-orange-500" />
                      Weather
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Temperature</span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {devices.terrace.weather.temp}°C
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Humidity</span>
                        <span className="font-bold">
                          {devices.terrace.weather.humidity}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Outdoor Lighting */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Outdoor Lights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(devices.terrace.lights).map(([area, isOn]) => (
                      <div key={area} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{area}</span>
                        <Button
                          size="sm"
                          variant={isOn ? "default" : "outline"}
                          onClick={() => toggleLight('terrace', area)}
                          className={isOn ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          {isOn ? "ON" : "OFF"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Cameras Tab */}
            <TabsContent value="security" className="space-y-6">
              <SecurityCameraGrid />
            </TabsContent>

            {/* Energy Analytics Tab */}
            <TabsContent value="energy" className="space-y-6">
              <EnergyAnalyticsDashboard />
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-6">
              <AutomationRulesManager />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <SarojaAIChat onDeviceControl={handleAICommand} />

      {/* Family Chat */}
      <SarojaFamilyChat />
    </div>
  );
}

