import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  Lightbulb,
  Wind,
  Lock,
  Unlock,
  Power,
  Zap,
  User,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  Smartphone,
  Bot
} from "lucide-react";

interface ActivityEvent {
  id: string;
  timestamp: Date;
  device: string;
  deviceType: 'light' | 'ac' | 'lock' | 'appliance' | 'security' | 'other';
  action: string;
  user: string;
  userType: 'manual' | 'automation' | 'ai' | 'schedule';
  status: 'success' | 'failed' | 'warning';
  details?: string;
  energyImpact?: number; // kWh
}

export default function ActivityLog() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock activity data
  const [activities] = useState<ActivityEvent[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60000),
      device: 'Living Room Lights',
      deviceType: 'light',
      action: 'Turned On',
      user: 'Jyothi',
      userType: 'manual',
      status: 'success',
      energyImpact: 0.05
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60000),
      device: 'Bedroom AC',
      deviceType: 'ac',
      action: 'Set to 24°C',
      user: 'Automation',
      userType: 'automation',
      status: 'success',
      details: 'Good Morning scene activated',
      energyImpact: 1.2
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 30 * 60000),
      device: 'Main Door Lock',
      deviceType: 'lock',
      action: 'Locked',
      user: 'Saroja AI',
      userType: 'ai',
      status: 'success',
      details: 'Voice command: "Lock all doors"'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 45 * 60000),
      device: 'Kitchen Lights',
      deviceType: 'light',
      action: 'Turned Off',
      user: 'Schedule',
      userType: 'schedule',
      status: 'success',
      details: 'Night mode schedule',
      energyImpact: -0.03
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 60 * 60000),
      device: 'Terrace Lights',
      deviceType: 'light',
      action: 'Failed to turn on',
      user: 'Aswini',
      userType: 'manual',
      status: 'failed',
      details: 'Device offline'
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 90 * 60000),
      device: 'Security System',
      deviceType: 'security',
      action: 'Armed',
      user: 'Automation',
      userType: 'automation',
      status: 'success',
      details: 'Leave Home scene'
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 120 * 60000),
      device: 'All Lights',
      deviceType: 'light',
      action: 'Turned Off',
      user: 'Guna',
      userType: 'manual',
      status: 'success',
      energyImpact: -0.15
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 180 * 60000),
      device: 'Living Room AC',
      deviceType: 'ac',
      action: 'Turned On',
      user: 'Schedule',
      userType: 'schedule',
      status: 'success',
      details: 'Evening comfort schedule',
      energyImpact: 1.5
    },
    {
      id: '9',
      timestamp: new Date(Date.now() - 240 * 60000),
      device: 'Water Heater',
      deviceType: 'appliance',
      action: 'Turned On',
      user: 'Saroja AI',
      userType: 'ai',
      status: 'success',
      details: 'Morning routine',
      energyImpact: 2.0
    },
    {
      id: '10',
      timestamp: new Date(Date.now() - 300 * 60000),
      device: 'Entrance Lights',
      deviceType: 'light',
      action: 'Turned On',
      user: 'Automation',
      userType: 'automation',
      status: 'success',
      details: 'Motion detected',
      energyImpact: 0.02
    }
  ]);

  const getDeviceIcon = (type: ActivityEvent['deviceType']) => {
    switch (type) {
      case 'light': return Lightbulb;
      case 'ac': return Wind;
      case 'lock': return Lock;
      case 'security': return AlertCircle;
      case 'appliance': return Zap;
      default: return Power;
    }
  };

  const getUserIcon = (type: ActivityEvent['userType']) => {
    switch (type) {
      case 'manual': return User;
      case 'automation': return Settings;
      case 'ai': return Bot;
      case 'schedule': return Clock;
      default: return User;
    }
  };

  const getStatusIcon = (status: ActivityEvent['status']) => {
    switch (status) {
      case 'success': return CheckCircle2;
      case 'failed': return AlertCircle;
      case 'warning': return Info;
      default: return Info;
    }
  };

  const getStatusColor = (status: ActivityEvent['status']) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchQuery === '' ||
      activity.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: activities.length,
    success: activities.filter(a => a.status === 'success').length,
    failed: activities.filter(a => a.status === 'failed').length,
    energySaved: activities.reduce((sum, a) => sum + (a.energyImpact || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Activity Log
          </h2>
          <p className="text-muted-foreground mt-1">
            Track all device activities and automation events
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Events</p>
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
                <p className="text-2xl font-bold">{stats.success}</p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                {stats.energySaved >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.abs(stats.energySaved).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">kWh Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => {
                const DeviceIcon = getDeviceIcon(activity.deviceType);
                const UserIcon = getUserIcon(activity.userType);
                const StatusIcon = getStatusIcon(activity.status);
                const statusColor = getStatusColor(activity.status);

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline Line */}
                    {index < filteredActivities.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-700" />
                    )}

                    {/* Activity Card */}
                    <div className="flex gap-4 group">
                      {/* Icon */}
                      <div className="relative z-10">
                        <div className={`p-3 rounded-full bg-gradient-to-br ${
                          activity.status === 'success'
                            ? 'from-green-400 to-emerald-500'
                            : activity.status === 'failed'
                            ? 'from-red-400 to-rose-500'
                            : 'from-yellow-400 to-orange-500'
                        } shadow-lg`}>
                          <DeviceIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 group-hover:border-purple-300 dark:group-hover:border-purple-700 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{activity.device}</h4>
                                <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {activity.action}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>

                          {activity.details && (
                            <p className="text-sm text-muted-foreground mb-2 italic">
                              {activity.details}
                            </p>
                          )}

                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="gap-1">
                              <UserIcon className="h-3 w-3" />
                              {activity.user}
                            </Badge>
                            {activity.energyImpact !== undefined && (
                              <Badge
                                variant="outline"
                                className={`gap-1 ${
                                  activity.energyImpact > 0
                                    ? 'text-orange-600 border-orange-300'
                                    : 'text-green-600 border-green-300'
                                }`}
                              >
                                <Zap className="h-3 w-3" />
                                {activity.energyImpact > 0 ? '+' : ''}{activity.energyImpact.toFixed(2)} kWh
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {activity.deviceType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No activities found</h3>
            <p className="text-muted-foreground text-center">
              {searchQuery ? 'Try adjusting your search' : 'Activity log is empty'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

