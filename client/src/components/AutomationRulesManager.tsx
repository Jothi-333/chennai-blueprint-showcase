import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Zap,
  Sun,
  Moon,
  Home,
  Film,
  Coffee,
  Bed,
  Shield,
  Lightbulb,
  Wind,
  Lock,
  Unlock,
  Power,
  Settings,
  Calendar,
  Activity,
  CheckCircle2,
  Circle
} from "lucide-react";
import { toast } from "sonner";

interface Scene {
  id: string;
  name: string;
  icon: any;
  description: string;
  actions: SceneAction[];
  color: string;
  active: boolean;
}

interface SceneAction {
  device: string;
  action: string;
  value?: any;
}

interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    type: 'time' | 'condition' | 'event';
    value: string;
    condition?: string;
  };
  actions: SceneAction[];
  days?: string[];
}

export default function AutomationRulesManager() {
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [isCreatingScene, setIsCreatingScene] = useState(false);
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // Predefined scenes
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 'good-morning',
      name: 'Good Morning',
      icon: Coffee,
      description: 'Wake up routine - lights on, AC off, curtains open',
      color: 'orange',
      active: false,
      actions: [
        { device: 'all_lights', action: 'turn_on', value: 80 },
        { device: 'all_ac', action: 'turn_off' },
        { device: 'bedroom_curtains', action: 'open' },
        { device: 'water_heater', action: 'turn_on' }
      ]
    },
    {
      id: 'movie-time',
      name: 'Movie Time',
      icon: Film,
      description: 'Dim lights, close curtains, turn on TV',
      color: 'purple',
      active: false,
      actions: [
        { device: 'living_lights', action: 'dim', value: 20 },
        { device: 'living_curtains', action: 'close' },
        { device: 'tv', action: 'turn_on' },
        { device: 'ac', action: 'set_temp', value: 24 }
      ]
    },
    {
      id: 'goodnight',
      name: 'Goodnight',
      icon: Moon,
      description: 'Turn off all lights, lock doors, set AC to sleep mode',
      color: 'blue',
      active: false,
      actions: [
        { device: 'all_lights', action: 'turn_off' },
        { device: 'all_doors', action: 'lock' },
        { device: 'bedroom_ac', action: 'set_temp', value: 26 },
        { device: 'security', action: 'arm' }
      ]
    },
    {
      id: 'leaving-home',
      name: 'Leaving Home',
      icon: Shield,
      description: 'Turn off everything, lock doors, arm security',
      color: 'red',
      active: false,
      actions: [
        { device: 'all_lights', action: 'turn_off' },
        { device: 'all_ac', action: 'turn_off' },
        { device: 'all_doors', action: 'lock' },
        { device: 'security', action: 'arm' },
        { device: 'water_pump', action: 'turn_off' }
      ]
    },
    {
      id: 'coming-home',
      name: 'Coming Home',
      icon: Home,
      description: 'Welcome home - lights on, AC on, security disarm',
      color: 'green',
      active: false,
      actions: [
        { device: 'entrance_lights', action: 'turn_on' },
        { device: 'living_ac', action: 'turn_on', value: 24 },
        { device: 'security', action: 'disarm' },
        { device: 'main_door', action: 'unlock' }
      ]
    },
    {
      id: 'energy-saving',
      name: 'Energy Saving',
      icon: Zap,
      description: 'Optimize energy - turn off unused devices',
      color: 'yellow',
      active: false,
      actions: [
        { device: 'unused_lights', action: 'turn_off' },
        { device: 'all_ac', action: 'set_temp', value: 26 },
        { device: 'water_heater', action: 'turn_off' },
        { device: 'solar_mode', action: 'enable' }
      ]
    }
  ]);

  // Automation rules
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'morning-routine',
      name: 'Morning Routine',
      enabled: true,
      trigger: { type: 'time', value: '06:30' },
      actions: [
        { device: 'bedroom_lights', action: 'turn_on', value: 50 },
        { device: 'water_heater', action: 'turn_on' }
      ],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    {
      id: 'evening-lights',
      name: 'Evening Lights',
      enabled: true,
      trigger: { type: 'time', value: '18:00' },
      actions: [
        { device: 'outdoor_lights', action: 'turn_on' },
        { device: 'living_lights', action: 'turn_on', value: 70 }
      ],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      id: 'night-security',
      name: 'Night Security',
      enabled: true,
      trigger: { type: 'time', value: '22:00' },
      actions: [
        { device: 'all_doors', action: 'lock' },
        { device: 'security', action: 'arm' },
        { device: 'outdoor_lights', action: 'turn_on' }
      ],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      id: 'high-temp-ac',
      name: 'High Temperature AC',
      enabled: true,
      trigger: { type: 'condition', value: 'temperature', condition: '> 32°C' },
      actions: [
        { device: 'all_ac', action: 'turn_on', value: 24 }
      ]
    },
    {
      id: 'motion-detected',
      name: 'Motion Detection Alert',
      enabled: true,
      trigger: { type: 'event', value: 'motion_detected' },
      actions: [
        { device: 'outdoor_lights', action: 'turn_on' },
        { device: 'camera', action: 'start_recording' }
      ]
    }
  ]);

  const activateScene = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    // Deactivate all other scenes
    setScenes(prev => prev.map(s => ({ ...s, active: s.id === sceneId })));
    setActiveScene(sceneId);

    // Execute scene actions (mock)
    toast.success(`"${scene.name}" scene activated!`, {
      description: scene.description
    });

    // Auto-deactivate after 2 seconds
    setTimeout(() => {
      setScenes(prev => prev.map(s => ({ ...s, active: false })));
      setActiveScene(null);
    }, 2000);
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    
    const rule = rules.find(r => r.id === ruleId);
    toast.success(
      rule?.enabled ? 'Automation disabled' : 'Automation enabled',
      { description: rule?.name }
    );
  };

  const getSceneColor = (color: string) => {
    const colors: Record<string, string> = {
      orange: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20',
      purple: 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
      blue: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
      red: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
      green: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      orange: 'text-orange-600 dark:text-orange-400',
      purple: 'text-purple-600 dark:text-purple-400',
      blue: 'text-blue-600 dark:text-blue-400',
      red: 'text-red-600 dark:text-red-400',
      green: 'text-green-600 dark:text-green-400',
      yellow: 'text-yellow-600 dark:text-yellow-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Film className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Scenes</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{scenes.length}</p>
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
                <p className="text-xs text-muted-foreground">Automations</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{rules.length}</p>
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
                <p className="text-xs text-muted-foreground">Enabled</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {rules.filter(r => r.enabled).length}
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
                <p className="text-xs text-muted-foreground">Triggered Today</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scenes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="scenes" className="gap-2">
            <Film className="h-4 w-4" />
            Scenes
          </TabsTrigger>
          <TabsTrigger value="automations" className="gap-2">
            <Zap className="h-4 w-4" />
            Automations
          </TabsTrigger>
        </TabsList>

        {/* Scenes Tab */}
        <TabsContent value="scenes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Scenes</h3>
              <p className="text-sm text-muted-foreground">Activate predefined scenes with one tap</p>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setIsCreatingScene(true)}>
              <Plus className="h-4 w-4" />
              Create Scene
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene) => {
              const Icon = scene.icon;
              return (
                <Card 
                  key={scene.id} 
                  className={`cursor-pointer transition-all ${getSceneColor(scene.color)} ${
                    scene.active ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => activateScene(scene.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full ${getSceneColor(scene.color)} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${getIconColor(scene.color)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{scene.name}</h4>
                          {scene.active && (
                            <Badge variant="default" className="gap-1">
                              <Play className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{scene.description}</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          {scene.actions.length} actions
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Automation Rules</h3>
              <p className="text-sm text-muted-foreground">Time-based and condition-based automations</p>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setIsCreatingRule(true)}>
              <Plus className="h-4 w-4" />
              Create Rule
            </Button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full ${
                        rule.enabled ? 'bg-green-500/20' : 'bg-gray-500/20'
                      } flex items-center justify-center`}>
                        {rule.trigger.type === 'time' && <Clock className={`h-5 w-5 ${
                          rule.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`} />}
                        {rule.trigger.type === 'condition' && <Activity className={`h-5 w-5 ${
                          rule.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`} />}
                        {rule.trigger.type === 'event' && <Zap className={`h-5 w-5 ${
                          rule.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{rule.name}</h4>
                          {rule.enabled ? (
                            <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 border-green-500/30">
                              <CheckCircle2 className="h-3 w-3" />
                              Enabled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <Circle className="h-3 w-3" />
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {rule.trigger.type === 'time' && <Clock className="h-3 w-3" />}
                            {rule.trigger.type === 'time' ? `At ${rule.trigger.value}` : 
                             rule.trigger.type === 'condition' ? `When ${rule.trigger.value} ${rule.trigger.condition}` :
                             `On ${rule.trigger.value}`}
                          </span>
                          {rule.days && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {rule.days.join(', ')}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {rule.actions.length} actions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={rule.enabled ? "default" : "outline"}
                        onClick={() => toggleRule(rule.id)}
                        className="gap-2"
                      >
                        {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

