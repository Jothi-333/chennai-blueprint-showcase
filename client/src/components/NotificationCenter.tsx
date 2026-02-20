import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellOff,
  AlertTriangle,
  Info,
  CheckCircle2,
  Zap,
  Lock,
  Unlock,
  Lightbulb,
  Wind,
  Camera,
  Battery,
  WifiOff,
  Thermometer,
  Droplet,
  Shield,
  X,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  category: 'security' | 'energy' | 'device' | 'automation' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  deviceId?: string;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  push: boolean;
  email: boolean;
  categories: {
    security: boolean;
    energy: boolean;
    device: boolean;
    automation: boolean;
    system: boolean;
  };
}

export default function NotificationCenter() {
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    push: true,
    email: false,
    categories: {
      security: true,
      energy: true,
      device: true,
      automation: true,
      system: true
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      category: 'security',
      title: 'Security Alert',
      message: 'Main door was unlocked at 11:45 PM',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      actionable: true,
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      category: 'device',
      title: 'Device Offline',
      message: 'Terrace lights are not responding',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      actionable: true,
      deviceId: 'terrace-lights',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      category: 'energy',
      title: 'Energy Savings',
      message: 'You saved 2.5 kWh today compared to yesterday',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
      actionable: false,
      priority: 'low'
    },
    {
      id: '4',
      type: 'success',
      category: 'automation',
      title: 'Scene Activated',
      message: 'Good Morning scene completed successfully',
      timestamp: new Date(Date.now() - 120 * 60000),
      read: true,
      actionable: false,
      priority: 'low'
    },
    {
      id: '5',
      type: 'warning',
      category: 'device',
      title: 'Low Battery',
      message: 'Bedroom motion sensor battery is at 15%',
      timestamp: new Date(Date.now() - 180 * 60000),
      read: false,
      actionable: true,
      priority: 'medium'
    },
    {
      id: '6',
      type: 'alert',
      category: 'security',
      title: 'Motion Detected',
      message: 'Motion detected in backyard at 2:30 AM',
      timestamp: new Date(Date.now() - 240 * 60000),
      read: true,
      actionable: true,
      priority: 'high'
    },
    {
      id: '7',
      type: 'info',
      category: 'system',
      title: 'System Update',
      message: 'Smart home system updated to version 2.1.0',
      timestamp: new Date(Date.now() - 300 * 60000),
      read: true,
      actionable: false,
      priority: 'low'
    },
    {
      id: '8',
      type: 'warning',
      category: 'energy',
      title: 'High Energy Usage',
      message: 'AC running for 8 hours continuously',
      timestamp: new Date(Date.now() - 360 * 60000),
      read: true,
      actionable: true,
      priority: 'medium'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getIcon = (category: Notification['category'], type: Notification['type']) => {
    if (type === 'alert') return AlertTriangle;
    if (type === 'success') return CheckCircle2;

    switch (category) {
      case 'security': return Shield;
      case 'energy': return Zap;
      case 'device': return Lightbulb;
      case 'automation': return Settings;
      case 'system': return Info;
      default: return Bell;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return 'from-red-500 to-rose-600';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'success': return 'from-green-500 to-emerald-600';
      case 'info': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' || !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Stay updated with your smart home alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">General</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label>Enable Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Label>Sound Alerts</Label>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.push}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.email}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Category Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Categories</h3>
              <div className="space-y-3">
                {Object.entries(settings.categories).map(([category, enabled]) => (
                  <div key={category} className="flex items-center justify-between">
                    <Label className="capitalize">{category}</Label>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        categories: { ...prev.categories, [category]: checked }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Notifications</CardTitle>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600">
              <X className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.category, notification.type);
                const gradient = getTypeColor(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`group relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      notification.read
                        ? 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20'
                        : 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Priority Indicator */}
                    {notification.priority === 'high' && !notification.read && (
                      <div className="absolute top-2 right-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      </div>
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-full bg-gradient-to-br ${gradient} shadow-lg flex-shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              notification.priority === 'high'
                                ? 'border-red-300 text-red-600'
                                : notification.priority === 'medium'
                                ? 'border-yellow-300 text-yellow-600'
                                : 'border-gray-300 text-gray-600'
                            }`}
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <Badge className="text-xs bg-purple-500">
                              New
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        {notification.actionable && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            {notification.category === 'device' && (
                              <Button size="sm" variant="outline">
                                Fix Issue
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            {filter === 'unread' ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center">
                  You have no unread notifications
                </p>
              </>
            ) : (
              <>
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center">
                  You're all set! We'll notify you when something happens
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

