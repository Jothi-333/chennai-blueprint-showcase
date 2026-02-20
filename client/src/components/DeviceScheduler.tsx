import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Sunrise,
  Sunset,
  Timer,
  Repeat,
  Lightbulb,
  Wind,
  Tv,
  Coffee,
  Zap,
  CheckCircle2,
  Circle,
  Play,
  Pause
} from "lucide-react";
import { toast } from "sonner";

interface Schedule {
  id: string;
  name: string;
  device: string;
  deviceType: 'light' | 'ac' | 'appliance' | 'other';
  action: string;
  time: string;
  days: string[];
  enabled: boolean;
  type: 'time' | 'sunrise' | 'sunset' | 'countdown';
  countdown?: number; // minutes
  offset?: number; // minutes before/after sunrise/sunset
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEVICE_TYPES = [
  { value: 'light', label: 'Lights', icon: Lightbulb, color: 'yellow' },
  { value: 'ac', label: 'Air Conditioning', icon: Wind, color: 'blue' },
  { value: 'appliance', label: 'Appliances', icon: Zap, color: 'purple' },
  { value: 'other', label: 'Other', icon: Circle, color: 'gray' }
];

export default function DeviceScheduler() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      name: 'Morning Lights',
      device: 'Living Room Lights',
      deviceType: 'light',
      action: 'Turn On',
      time: '06:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      enabled: true,
      type: 'time'
    },
    {
      id: '2',
      name: 'Evening AC',
      device: 'Bedroom AC',
      deviceType: 'ac',
      action: 'Turn On (24°C)',
      time: '18:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      type: 'time'
    },
    {
      id: '3',
      name: 'Sunset Outdoor Lights',
      device: 'Terrace Lights',
      deviceType: 'light',
      action: 'Turn On',
      time: 'Sunset',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      type: 'sunset',
      offset: 0
    },
    {
      id: '4',
      name: 'Night Mode',
      device: 'All Lights',
      deviceType: 'light',
      action: 'Turn Off',
      time: '22:30',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      type: 'time'
    },
    {
      id: '5',
      name: 'Coffee Maker',
      device: 'Kitchen Coffee Maker',
      deviceType: 'appliance',
      action: 'Turn On',
      time: '06:30',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      enabled: false,
      type: 'time'
    }
  ]);

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      toast.success(schedule.enabled ? 'Schedule disabled' : 'Schedule enabled');
    }
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Schedule deleted');
  };

  const getDeviceIcon = (type: Schedule['deviceType']) => {
    const deviceType = DEVICE_TYPES.find(d => d.value === type);
    return deviceType?.icon || Circle;
  };

  const getDeviceColor = (type: Schedule['deviceType']) => {
    const deviceType = DEVICE_TYPES.find(d => d.value === type);
    return deviceType?.color || 'gray';
  };

  const formatTime = (schedule: Schedule) => {
    if (schedule.type === 'sunrise') {
      return `Sunrise ${schedule.offset ? (schedule.offset > 0 ? `+${schedule.offset}m` : `${schedule.offset}m`) : ''}`;
    }
    if (schedule.type === 'sunset') {
      return `Sunset ${schedule.offset ? (schedule.offset > 0 ? `+${schedule.offset}m` : `${schedule.offset}m`) : ''}`;
    }
    if (schedule.type === 'countdown') {
      return `${schedule.countdown} minutes`;
    }
    return schedule.time;
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.deviceType]) {
      acc[schedule.deviceType] = [];
    }
    acc[schedule.deviceType].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Device Schedules
          </h2>
          <p className="text-muted-foreground mt-1">
            Automate your devices with smart scheduling
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Schedule</DialogTitle>
              <DialogDescription>
                Set up automated device control
              </DialogDescription>
            </DialogHeader>
            <ScheduleForm onClose={() => setIsCreating(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{schedules.filter(s => s.enabled).length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Circle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{schedules.filter(s => !s.enabled).length}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{schedules.filter(s => s.type === 'time').length}</p>
                <p className="text-xs text-muted-foreground">Time-based</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Sunrise className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {schedules.filter(s => s.type === 'sunrise' || s.type === 'sunset').length}
                </p>
                <p className="text-xs text-muted-foreground">Sun-based</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules by Device Type */}
      <div className="space-y-6">
        {Object.entries(groupedSchedules).map(([deviceType, deviceSchedules]) => {
          const Icon = getDeviceIcon(deviceType as Schedule['deviceType']);
          const color = getDeviceColor(deviceType as Schedule['deviceType']);
          const deviceTypeInfo = DEVICE_TYPES.find(d => d.value === deviceType);

          return (
            <Card key={deviceType}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 text-${color}-500`} />
                  {deviceTypeInfo?.label || deviceType}
                  <Badge variant="secondary" className="ml-2">
                    {deviceSchedules.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deviceSchedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      onToggle={() => toggleSchedule(schedule.id)}
                      onEdit={() => setEditingSchedule(schedule)}
                      onDelete={() => deleteSchedule(schedule.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {schedules.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No schedules yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first schedule to automate your devices
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Schedule Card Component
interface ScheduleCardProps {
  schedule: Schedule;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ScheduleCard({ schedule, onToggle, onEdit, onDelete }: ScheduleCardProps) {
  const Icon = schedule.type === 'sunrise' ? Sunrise : schedule.type === 'sunset' ? Sunset : schedule.type === 'countdown' ? Timer : Clock;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
      schedule.enabled
        ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20'
        : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20'
    }`}>
      {/* Icon & Time */}
      <div className="flex items-center gap-3 flex-1">
        <div className={`p-2 rounded-lg ${
          schedule.enabled
            ? 'bg-blue-100 dark:bg-blue-900/50'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <Icon className={`h-5 w-5 ${
            schedule.enabled
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-400'
          }`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{schedule.name}</h4>
            {schedule.enabled && (
              <Badge variant="default" className="text-xs bg-green-500">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{formatTime(schedule)}</span>
            <span>•</span>
            <span>{schedule.device}</span>
            <span>•</span>
            <span>{schedule.action}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {schedule.days.map(day => (
              <Badge key={day} variant="outline" className="text-xs px-1.5 py-0">
                {day}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Switch
          checked={schedule.enabled}
          onCheckedChange={onToggle}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Schedule Form Component (placeholder)
function ScheduleForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Schedule Name</Label>
        <Input placeholder="e.g., Morning Lights" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Device</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="living-lights">Living Room Lights</SelectItem>
              <SelectItem value="bedroom-ac">Bedroom AC</SelectItem>
              <SelectItem value="kitchen-lights">Kitchen Lights</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Action</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on">Turn On</SelectItem>
              <SelectItem value="off">Turn Off</SelectItem>
              <SelectItem value="dim">Dim</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Time</Label>
        <Input type="time" />
      </div>
      <div className="space-y-2">
        <Label>Repeat Days</Label>
        <div className="flex gap-2">
          {DAYS.map(day => (
            <Button key={day} variant="outline" size="sm" className="flex-1">
              {day}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onClose} className="flex-1">
          Create Schedule
        </Button>
      </div>
    </div>
  );
}

