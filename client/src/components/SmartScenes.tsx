import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Play, 
  Plus, 
  Edit, 
  Trash2, 
  Sun,
  Moon,
  Film,
  Coffee,
  Bed,
  Home,
  Sparkles,
  Heart,
  Users,
  Utensils,
  BookOpen,
  Music,
  Flower2,
  PartyPopper,
  Check,
  Clock,
  Zap,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface SceneAction {
  device: string;
  action: string;
  value?: any;
  room?: string;
}

interface Scene {
  id: string;
  name: string;
  icon: any;
  description: string;
  actions: SceneAction[];
  color: string;
  gradient: string;
  active: boolean;
  favorite: boolean;
  category: 'morning' | 'evening' | 'entertainment' | 'comfort' | 'security' | 'custom';
}

export default function SmartScenes() {
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [isCreatingScene, setIsCreatingScene] = useState(false);

  // Predefined scenes with beautiful gradients
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 'good-morning-amma',
      name: 'Good Morning, Amma',
      icon: Coffee,
      description: 'Wake up gently - lights on, curtains open, water heater ready',
      color: 'orange',
      gradient: 'from-orange-400 to-pink-500',
      category: 'morning',
      active: false,
      favorite: true,
      actions: [
        { device: 'bedroom_lights', action: 'turn_on', value: 60, room: 'Bedroom' },
        { device: 'living_lights', action: 'turn_on', value: 80, room: 'Living Room' },
        { device: 'kitchen_lights', action: 'turn_on', value: 100, room: 'Kitchen' },
        { device: 'all_curtains', action: 'open' },
        { device: 'water_heater', action: 'turn_on' },
        { device: 'ac', action: 'turn_off' }
      ]
    },
    {
      id: 'pooja-time',
      name: 'Pooja Time',
      icon: Flower2,
      description: 'Sacred atmosphere - soft lights, peaceful ambiance',
      color: 'amber',
      gradient: 'from-amber-400 to-orange-500',
      category: 'custom',
      active: false,
      favorite: true,
      actions: [
        { device: 'pooja_lights', action: 'turn_on', value: 100, room: 'Pooja Room' },
        { device: 'living_lights', action: 'dim', value: 40, room: 'Living Room' },
        { device: 'music_system', action: 'play', value: 'devotional' },
        { device: 'ac', action: 'set_temp', value: 24 }
      ]
    },
    {
      id: 'movie-night',
      name: 'Movie Night',
      icon: Film,
      description: 'Cinema experience - dim lights, perfect temperature',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      category: 'entertainment',
      active: false,
      favorite: false,
      actions: [
        { device: 'living_lights', action: 'dim', value: 15, room: 'Living Room' },
        { device: 'tv', action: 'turn_on' },
        { device: 'curtains', action: 'close', room: 'Living Room' },
        { device: 'ac', action: 'set_temp', value: 23 }
      ]
    },
    {
      id: 'sleep-mode',
      name: 'Sleep Mode',
      icon: Moon,
      description: 'Good night - all lights off, doors locked, security on',
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-600',
      category: 'evening',
      active: false,
      favorite: true,
      actions: [
        { device: 'all_lights', action: 'turn_off' },
        { device: 'all_doors', action: 'lock' },
        { device: 'security_system', action: 'arm' },
        { device: 'ac', action: 'set_temp', value: 25 },
        { device: 'bedroom_lights', action: 'night_light', value: 5 }
      ]
    },
    {
      id: 'welcome-home',
      name: 'Welcome Home',
      icon: Home,
      description: 'Warm welcome - entrance lights, comfortable temperature',
      color: 'green',
      gradient: 'from-green-400 to-emerald-500',
      category: 'comfort',
      active: false,
      favorite: false,
      actions: [
        { device: 'entrance_lights', action: 'turn_on', value: 100, room: 'Entrance' },
        { device: 'living_lights', action: 'turn_on', value: 70, room: 'Living Room' },
        { device: 'ac', action: 'turn_on', value: 24 },
        { device: 'security_system', action: 'disarm' }
      ]
    },
    {
      id: 'family-gathering',
      name: 'Family Gathering',
      icon: Users,
      description: 'Perfect for family time - bright lights, comfortable setting',
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-500',
      category: 'entertainment',
      active: false,
      favorite: false,
      actions: [
        { device: 'all_lights', action: 'turn_on', value: 85 },
        { device: 'ac', action: 'set_temp', value: 24 },
        { device: 'music_system', action: 'play', value: 'family_playlist' }
      ]
    },
    {
      id: 'dinner-time',
      name: 'Dinner Time',
      icon: Utensils,
      description: 'Cozy dining atmosphere - warm lights, pleasant ambiance',
      color: 'rose',
      gradient: 'from-rose-400 to-pink-500',
      category: 'evening',
      active: false,
      favorite: false,
      actions: [
        { device: 'dining_lights', action: 'turn_on', value: 75, room: 'Dining Room' },
        { device: 'kitchen_lights', action: 'turn_on', value: 90, room: 'Kitchen' },
        { device: 'living_lights', action: 'dim', value: 50, room: 'Living Room' }
      ]
    },
    {
      id: 'reading-time',
      name: 'Reading Time',
      icon: BookOpen,
      description: 'Perfect lighting for reading - focused and comfortable',
      color: 'teal',
      gradient: 'from-teal-400 to-cyan-500',
      category: 'comfort',
      active: false,
      favorite: false,
      actions: [
        { device: 'reading_lamp', action: 'turn_on', value: 100 },
        { device: 'room_lights', action: 'dim', value: 30 },
        { device: 'ac', action: 'set_temp', value: 23 }
      ]
    },
    {
      id: 'party-mode',
      name: 'Party Mode',
      icon: PartyPopper,
      description: 'Celebration time - colorful lights, energetic vibe',
      color: 'fuchsia',
      gradient: 'from-fuchsia-500 to-pink-600',
      category: 'entertainment',
      active: false,
      favorite: false,
      actions: [
        { device: 'all_lights', action: 'color_cycle' },
        { device: 'music_system', action: 'play', value: 'party_playlist' },
        { device: 'ac', action: 'set_temp', value: 22 }
      ]
    },
    {
      id: 'leave-home',
      name: 'Leave Home',
      icon: Zap,
      description: 'Energy saving - all off, security armed',
      color: 'slate',
      gradient: 'from-slate-400 to-gray-600',
      category: 'security',
      active: false,
      favorite: true,
      actions: [
        { device: 'all_lights', action: 'turn_off' },
        { device: 'all_ac', action: 'turn_off' },
        { device: 'all_appliances', action: 'turn_off' },
        { device: 'all_doors', action: 'lock' },
        { device: 'security_system', action: 'arm' }
      ]
    }
  ]);

  const activateScene = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setActiveScene(sceneId);
    setScenes(prev => prev.map(s => ({
      ...s,
      active: s.id === sceneId
    })));

    toast.success(`${scene.name} activated! 🎉`, {
      description: scene.description
    });

    // Simulate scene activation
    setTimeout(() => {
      setActiveScene(null);
    }, 3000);
  };

  const toggleFavorite = (sceneId: string) => {
    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, favorite: !s.favorite } : s
    ));
  };

  const deleteScene = (sceneId: string) => {
    setScenes(prev => prev.filter(s => s.id !== sceneId));
    toast.success("Scene deleted");
  };

  const getCategoryScenes = (category: Scene['category']) => {
    return scenes.filter(s => s.category === category);
  };

  const favoriteScenes = scenes.filter(s => s.favorite);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Smart Scenes
          </h2>
          <p className="text-muted-foreground mt-1">
            One-tap automation for your perfect moments
          </p>
        </div>
        <Dialog open={isCreatingScene} onOpenChange={setIsCreatingScene}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Scene
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Scene</DialogTitle>
              <DialogDescription>
                Design your perfect automation scene
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Scene Name</Label>
                <Input placeholder="e.g., Morning Yoga" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Describe what this scene does" />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <p className="text-sm text-muted-foreground">
                  Add devices and actions for this scene
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Favorite Scenes - Quick Access */}
      {favoriteScenes.length > 0 && (
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
              Favorite Scenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {favoriteScenes.map((scene) => {
                const Icon = scene.icon;
                return (
                  <button
                    key={scene.id}
                    onClick={() => activateScene(scene.id)}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      activeScene === scene.id
                        ? 'border-purple-500 bg-gradient-to-br ' + scene.gradient + ' text-white'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-full ${
                        activeScene === scene.id
                          ? 'bg-white/20'
                          : 'bg-gradient-to-br ' + scene.gradient
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          activeScene === scene.id ? 'text-white' : 'text-white'
                        }`} />
                      </div>
                      <span className={`text-sm font-medium text-center ${
                        activeScene === scene.id ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {scene.name}
                      </span>
                    </div>
                    {activeScene === scene.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Scenes - Categorized */}
      <div className="grid gap-6">
        {/* Morning Scenes */}
        {getCategoryScenes('morning').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" />
                Morning Routines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryScenes('morning').map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={activeScene === scene.id}
                    onActivate={() => activateScene(scene.id)}
                    onToggleFavorite={() => toggleFavorite(scene.id)}
                    onDelete={() => deleteScene(scene.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evening Scenes */}
        {getCategoryScenes('evening').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-500" />
                Evening & Night
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryScenes('evening').map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={activeScene === scene.id}
                    onActivate={() => activateScene(scene.id)}
                    onToggleFavorite={() => toggleFavorite(scene.id)}
                    onDelete={() => deleteScene(scene.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entertainment Scenes */}
        {getCategoryScenes('entertainment').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Entertainment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryScenes('entertainment').map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={activeScene === scene.id}
                    onActivate={() => activateScene(scene.id)}
                    onToggleFavorite={() => toggleFavorite(scene.id)}
                    onDelete={() => deleteScene(scene.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comfort Scenes */}
        {getCategoryScenes('comfort').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-green-500" />
                Comfort & Relaxation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryScenes('comfort').map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={activeScene === scene.id}
                    onActivate={() => activateScene(scene.id)}
                    onToggleFavorite={() => toggleFavorite(scene.id)}
                    onDelete={() => deleteScene(scene.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Scenes */}
        {getCategoryScenes('security').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-500" />
                Security & Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryScenes('security').map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={activeScene === scene.id}
                    onActivate={() => activateScene(scene.id)}
                    onToggleFavorite={() => toggleFavorite(scene.id)}
                    onDelete={() => deleteScene(scene.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Scenes */}
        {getCategoryScenes('custom').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Custom Scenes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryScenes('custom').map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={activeScene === scene.id}
                    onActivate={() => activateScene(scene.id)}
                    onToggleFavorite={() => toggleFavorite(scene.id)}
                    onDelete={() => deleteScene(scene.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Scene Card Component
interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  onActivate: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

function SceneCard({ scene, isActive, onActivate, onToggleFavorite, onDelete }: SceneCardProps) {
  const Icon = scene.icon;

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isActive ? 'ring-2 ring-purple-500 shadow-lg' : ''
    }`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${scene.gradient} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart className={`h-4 w-4 ${scene.favorite ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
            </Button>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2">{scene.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {scene.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {scene.actions.length} actions
          </Badge>
          {isActive && (
            <Badge className="text-xs bg-green-500">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        <Button
          onClick={onActivate}
          className={`w-full ${
            isActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r ' + scene.gradient
          }`}
          disabled={isActive}
        >
          {isActive ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Running
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Activate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
