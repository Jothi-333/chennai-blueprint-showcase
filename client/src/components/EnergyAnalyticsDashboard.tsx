import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Sun, 
  Battery,
  Home,
  DollarSign,
  Calendar,
  Clock,
  Lightbulb,
  Wind,
  Tv,
  Droplet,
  Activity
} from "lucide-react";

export default function EnergyAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Mock data for hourly consumption (today)
  const hourlyData = [
    { hour: '00:00', consumption: 2.1, solar: 0, grid: 2.1 },
    { hour: '03:00', consumption: 1.8, solar: 0, grid: 1.8 },
    { hour: '06:00', consumption: 3.2, solar: 0.5, grid: 2.7 },
    { hour: '09:00', consumption: 4.5, solar: 2.8, grid: 1.7 },
    { hour: '12:00', consumption: 5.2, solar: 4.2, grid: 1.0 },
    { hour: '15:00', consumption: 4.8, solar: 3.5, grid: 1.3 },
    { hour: '18:00', consumption: 6.5, solar: 1.2, grid: 5.3 },
    { hour: '21:00', consumption: 5.8, solar: 0, grid: 5.8 },
  ];

  // Mock data for weekly consumption
  const weeklyData = [
    { day: 'Mon', consumption: 28.5, solar: 22.0, grid: 6.5, cost: 52 },
    { day: 'Tue', consumption: 32.1, solar: 24.5, grid: 7.6, cost: 61 },
    { day: 'Wed', consumption: 26.8, solar: 21.2, grid: 5.6, cost: 45 },
    { day: 'Thu', consumption: 30.2, solar: 23.8, grid: 6.4, cost: 51 },
    { day: 'Fri', consumption: 29.5, solar: 22.5, grid: 7.0, cost: 56 },
    { day: 'Sat', consumption: 35.2, solar: 26.0, grid: 9.2, cost: 74 },
    { day: 'Sun', consumption: 33.8, solar: 25.5, grid: 8.3, cost: 66 },
  ];

  // Mock data for monthly consumption
  const monthlyData = [
    { week: 'Week 1', consumption: 195, solar: 155, grid: 40, cost: 320 },
    { week: 'Week 2', consumption: 210, solar: 168, grid: 42, cost: 336 },
    { week: 'Week 3', consumption: 188, solar: 152, grid: 36, cost: 288 },
    { week: 'Week 4', consumption: 205, solar: 165, grid: 40, cost: 320 },
  ];

  // Device-wise consumption breakdown
  const deviceData = [
    { name: 'Air Conditioning', consumption: 12.5, percentage: 45, color: '#3b82f6' },
    { name: 'Water Heater', consumption: 5.5, percentage: 20, color: '#f97316' },
    { name: 'Lighting', consumption: 3.8, percentage: 14, color: '#eab308' },
    { name: 'Kitchen Appliances', consumption: 2.8, percentage: 10, color: '#22c55e' },
    { name: 'Entertainment', consumption: 1.9, percentage: 7, color: '#8b5cf6' },
    { name: 'Others', consumption: 1.0, percentage: 4, color: '#6b7280' },
  ];

  // Current stats
  const currentStats = {
    totalConsumption: 28.5,
    solarGeneration: 22.0,
    gridUsage: 6.5,
    batterySaved: 18.0,
    costToday: 52,
    costSaved: 176,
    carbonOffset: 15.4,
    efficiency: 77
  };

  const getDataByRange = () => {
    switch (timeRange) {
      case 'today': return hourlyData;
      case 'week': return weeklyData;
      case 'month': return monthlyData;
      default: return hourlyData;
    }
  };

  const formatCurrency = (value: number) => `₹${value}`;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consumption */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Consumption</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentStats.totalConsumption} kWh
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">15% less</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solar Generation */}
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Sun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Solar Generated</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {currentStats.solarGeneration} kWh
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">{currentStats.efficiency}% efficient</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Usage */}
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Home className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Grid Usage</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {currentStats.gridUsage} kWh
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Battery className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">{currentStats.batterySaved} kWh saved</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Today */}
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Cost Today</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(currentStats.costToday)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Saved ₹{currentStats.costSaved}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consumption Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Energy Consumption
              </CardTitle>
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)} className="w-auto">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
                  <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDataByRange()}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey={timeRange === 'today' ? 'hour' : timeRange === 'week' ? 'day' : 'week'} 
                  stroke="currentColor"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="currentColor"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Legend />
                <Bar dataKey="solar" fill="#eab308" name="Solar" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grid" fill="#f97316" name="Grid" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="consumption"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-muted-foreground">{device.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{device.consumption} kWh</span>
                    <Badge variant="outline" className="text-xs">{device.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

