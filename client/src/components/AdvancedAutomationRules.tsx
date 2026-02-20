import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Plus, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  Copy,
  Clock,
  Thermometer,
  Droplet,
  Sun,
  Moon,
  Cloud,
  Wind,
  Lightbulb,
  Lock,
  Unlock,
  Camera,
  Bell,
  Smartphone,
  Home,
  Users,
  MapPin,
  Activity,
  CheckCircle2,
  AlertCircle,
  Info,
  Settings,
  ArrowRight,
  GitBranch,
  Layers
} from "lucide-react";
import { toast } from "sonner";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type: 'time' | 'device' | 'weather' | 'sensor' | 'location' | 'manual';
    condition: string;
    value: any;
  };
  conditions: {
    type: string;
    operator: 'equals' | 'greater' | 'less' | 'between';
    value: any;
  }[];
  actions: {
    device: string;
    action: string;
    value: any;
    delay?: number;
  }[];
  category: 'comfort' | 'security' | 'energy' | 'custom';
  lastTriggered?: Date;
  triggerCount: number;
}

const TRIGGER_TYPES = [
  { value: 'time', label: 'Time-based', icon: Clock },
  { value: 'device', label: 'Device Status', icon: Lightbulb },
  { value: 'weather', label: 'Weather', icon: Cloud },
  { value: 'sensor', label: 'Sensor Data', icon: Activity },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'manual', label: 'Manual Trigger', icon: Smartphone }
];

const CONDITION_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'greater', label: 'Greater than' },
  { value: 'less', label: 'Less than' },
  { value: 'between', label: 'Between' }
];

export default function AdvancedAutomationRules() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Smart Climate Control',
      description: 'Adjust AC based on temperature and occupancy',
      enabled: true,
      trigger: {
        type: 'sensor',
        condition: 'Temperature',
        value: 28
      },
      conditions: [
        { type: 'temperature', operator: 'greater', value: 28 },
        { type: 'occupancy', operator: 'equals', value: true }
      ],
      actions: [
        { device: 'Living Room AC', action: 'Turn On', value: 24 },
        { device: 'Ceiling Fan', action: 'Set Speed', value: 3 }
      ],
      category: 'comfort',
      lastTriggered: new Date(Date.now() - 2 * 60 * 60000),
      triggerCount: 45
    },
    {
      id: '2',
      name: 'Security Night Mode',
      description: 'Activate security when everyone leaves after sunset',
      enabled: true,
      trigger: {
        type: 'location',
        condition: 'Everyone Left',
        value: 'home'
      },
      conditions: [
        { type: 'time', operator: 'greater', value: '18:00' },
        { type: 'presence', operator: 'equals', value: false }
      ],
      actions: [
        { device: 'All Doors', action: 'Lock', value: true },
        { device: 'Security System', action: 'Arm', value: 'away' },
        { device: 'Outdoor Lights', action: 'Turn On', value: 100 },
        { device: 'Cameras', action: 'Start Recording', value: true }
      ],
      category: 'security',
      lastTriggered: new Date(Date.now() - 24 * 60 * 60000),
      triggerCount: 12
    },
    {
      id: '3',
      name: 'Energy Saver',
      description: 'Turn off idle devices during peak hours',
      enabled: true,
      trigger: {
        type: 'time',
        condition: 'Peak Hours',
        value: '18:00'
      },
      conditions: [
        { type: 'time', operator: 'between', value: ['18:00', '22:00'] },
        { type: 'device_idle', operator: 'greater', value: 30 }
      ],
      actions: [
        { device: 'Idle Lights', action: 'Turn Off', value: null },
        { device: 'Standby Appliances', action: 'Power Off', value: null }
      ],
      category: 'energy',
      lastTriggered: new Date(Date.now() - 60 * 60000),
      triggerCount: 89
    },
    {
      id: '4',
      name: 'Morning Routine',
      description: 'Gradual wake-up with lights and temperature',
      enabled: true,
      trigger: {
        type: 'time',
        condition: 'Weekday Morning',
        value: '06:00'
      },
      conditions: [
        { type: 'day', operator: 'equals', value: 'weekday' },
        { type: 'time', operator: 'equals', value: '06:00' }
      ],
      actions: [
        { device: 'Bedroom Lights', action: 'Fade In', value: 30, delay: 0 },
        { device: 'Bedroom AC', action: 'Set Temperature', value: 25, delay: 5 },
        { device: 'Coffee Maker', action: 'Turn On', value: true, delay: 10 },
        { device: 'Curtains', action: 'Open', value: 100, delay: 15 }
      ],
      category: 'comfort',
      lastTriggered: new Date(Date.now() - 24 * 60 * 60000),
      triggerCount: 156
    },
    {
      id: '5',
      name: 'Rain Detection',
      description: 'Close windows and adjust climate when it rains',
      enabled: false,
      trigger: {
        type: 'weather',
        condition: 'Rain Detected',
        value: 'rain'
      },
      conditions: [
        { type: 'weather', operator: 'equals', value: 'rain' },
        { type: 'windows', operator: 'equals', value: 'open' }
      ],
      actions: [
        { device: 'All Windows', action: 'Close', value: true },
        { device: 'Outdoor Lights', action: 'Turn On', value: 80 },
        { device: 'Dehumidifier', action: 'Turn On', value: 'auto' }
      ],
      category: 'custom',
      triggerCount: 3
    }
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast.success(rule.enabled ? 'Rule disabled' : 'Rule enabled');
    }
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success('Rule deleted');
  };

  const duplicateRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      const newRule = {
        ...rule,
        id: Date.now().toString(),
        name: `${rule.name} (Copy)`,
        enabled: false,
        triggerCount: 0,
        lastTriggered: undefined
      };
      setRules(prev => [...prev, newRule]);
      toast.success('Rule duplicated');
    }
  };

  const testRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast.success(`Testing "${rule.name}"...`, {
        description: `Executing ${rule.actions.length} actions`
      });
    }
  };

  const getTriggerIcon = (type: string) => {
    const trigger = TRIGGER_TYPES.find(t => t.value === type);
    return trigger?.icon || Zap;
  };

  const getCategoryColor = (category: AutomationRule['category']) => {
    switch (category) {
      case 'comfort': return 'blue';
      case 'security': return 'red';
      case 'energy': return 'green';
      case 'custom': return 'purple';
      default: return 'gray';
    }
  };

  const formatLastTriggered = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (60 * 60000));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredRules = rules.filter(rule => {
    if (filter === 'active') return rule.enabled;
    if (filter === 'inactive') return !rule.enabled;
    return true;
  });

  const stats = {
    total: rules.length,
    active: rules.filter(r => r.enabled).length,
    inactive: rules.filter(r => !r.enabled).length,
    totalTriggers: rules.reduce((sum, r) => sum + r.triggerCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced Automation
          </h2>
          <p className="text-muted-foreground mt-1">
            Create intelligent rules with triggers, conditions, and actions
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="h-4 w-4" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
              <DialogDescription>
                Build custom automation with triggers, conditions, and actions
              </DialogDescription>
            </DialogHeader>
            <RuleForm onClose={() => setIsCreating(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Pause className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTriggers}</p>
                <p className="text-xs text-muted-foreground">Total Triggers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => {
          const TriggerIcon = getTriggerIcon(rule.trigger.type);
          const categoryColor = getCategoryColor(rule.category);

          return (
            <Card
              key={rule.id}
              className={`border-2 transition-all hover:shadow-lg ${
                rule.enabled
                  ? 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${
                    rule.enabled
                      ? 'from-purple-500 to-pink-600'
                      : 'from-gray-400 to-gray-500'
                  } shadow-lg`}>
                    <TriggerIcon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{rule.name}</h3>
                          {rule.enabled && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                          <Badge variant="outline" className={`capitalize border-${categoryColor}-300 text-${categoryColor}-600`}>
                            {rule.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>

                    {/* Rule Flow */}
                    <div className="flex items-center gap-2 my-4 flex-wrap">
                      {/* Trigger */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                        <TriggerIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <div className="text-xs">
                          <div className="font-semibold text-blue-600 dark:text-blue-400">TRIGGER</div>
                          <div className="text-muted-foreground">{rule.trigger.condition}</div>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground" />

                      {/* Conditions */}
                      {rule.conditions.length > 0 && (
                        <>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700">
                            <GitBranch className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <div className="text-xs">
                              <div className="font-semibold text-yellow-600 dark:text-yellow-400">CONDITIONS</div>
                              <div className="text-muted-foreground">{rule.conditions.length} checks</div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                        <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <div className="text-xs">
                          <div className="font-semibold text-green-600 dark:text-green-400">ACTIONS</div>
                          <div className="text-muted-foreground">{rule.actions.length} devices</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions List */}
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-semibold text-muted-foreground">Actions:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rule.actions.map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs p-2 rounded bg-gray-100 dark:bg-gray-800">
                            <Lightbulb className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{action.device}</span>
                            <span className="text-muted-foreground">→</span>
                            <span>{action.action}</span>
                            {action.delay && action.delay > 0 && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                +{action.delay}min
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Triggered {rule.triggerCount} times
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last: {formatLastTriggered(rule.lastTriggered)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testRule(rule.id)}
                          className="h-8 gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateRule(rule.id)}
                          className="h-8 gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRule(rule)}
                          className="h-8 gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteRule(rule.id)}
                          className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRules.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No automation rules</h3>
            <p className="text-muted-foreground text-center mb-4">
              {filter === 'all'
                ? 'Create your first automation rule to get started'
                : `No ${filter} rules found`}
            </p>
            {filter === 'all' && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rule Templates */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Quick Start Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Welcome Home', desc: 'Lights & climate when you arrive', icon: Home },
              { name: 'Good Night', desc: 'Lock doors & turn off lights', icon: Moon },
              { name: 'Energy Saver', desc: 'Optimize power during peak hours', icon: Zap }
            ].map((template, idx) => {
              const Icon = template.icon;
              return (
                <div key={idx} className="p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{template.desc}</p>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 p-0">
                        Use Template
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Rule Form Component (placeholder)
function RuleForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Rule Name</Label>
        <Input placeholder="e.g., Smart Climate Control" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input placeholder="What does this rule do?" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Trigger Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              {TRIGGER_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comfort">Comfort</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
          Create Rule
        </Button>
      </div>
    </div>
  );
}


