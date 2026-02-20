import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
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
  Activity,
  AlertCircle,
  CheckCircle2,
  Target,
  Leaf,
  Download,
  Settings,
  Info,
  ArrowRight,
  Sparkles
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

  // Energy-saving recommendations
  const recommendations = [
    {
      id: '1',
      title: 'AC Running Too Long',
      description: 'Bedroom AC has been running for 8 hours. Consider setting a timer.',
      impact: 'Save ₹45/day',
      priority: 'high',
      icon: Wind
    },
    {
      id: '2',
      title: 'Peak Hour Usage',
      description: 'High consumption during peak hours (6-10 PM). Shift usage to off-peak.',
      impact: 'Save ₹120/month',
      priority: 'medium',
      icon: Clock
    },
    {
      id: '3',
      title: 'Lights Left On',
      description: '3 lights have been on for over 4 hours with no motion detected.',
      impact: 'Save ₹15/day',
      priority: 'medium',
      icon: Lightbulb
    },
    {
      id: '4',
      title: 'Solar Optimization',
      description: 'Run heavy appliances between 10 AM - 2 PM for maximum solar usage.',
      impact: 'Save ₹200/month',
      priority: 'low',
      icon: Sun
    }
  ];

  // Real-time device monitoring
  const liveDevices = [
    { name: 'Living Room AC', power: 1.5, status: 'on', cost: 12, icon: Wind, color: 'blue' },
    { name: 'Water Heater', power: 2.0, status: 'on', cost: 16, icon: Droplet, color: 'orange' },
    { name: 'Kitchen Lights', power: 0.05, status: 'on', cost: 0.4, icon: Lightbulb, color: 'yellow' },
    { name: 'TV', power: 0.15, status: 'on', cost: 1.2, icon: Tv, color: 'purple' }
  ];

  // Monthly budget tracking
  const monthlyBudget = {
    limit: 2000,
    current: 1456,
    projected: 1890,
    daysLeft: 12
  };

  const budgetPercentage = (monthlyBudget.current / monthlyBudget.limit) * 100;
  const projectedPercentage = (monthlyBudget.projected / monthlyBudget.limit) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Energy Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor consumption, track costs, and optimize energy usage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

      {/* Real-Time Monitoring & Budget Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Device Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Live Monitoring
              <Badge className="ml-2 bg-green-500 animate-pulse">
                Real-time
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveDevices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                    <div className={`p-2 rounded-lg bg-${device.color}-100 dark:bg-${device.color}-900/30`}>
                      <Icon className={`h-5 w-5 text-${device.color}-600 dark:text-${device.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{device.name}</h4>
                        <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/20 border-green-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {device.power} kW
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ₹{device.cost}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Total Power Draw</span>
                  <span className="text-green-600 dark:text-green-400">
                    {liveDevices.reduce((sum, d) => sum + d.power, 0).toFixed(2)} kW
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                  <span>Current Cost Rate</span>
                  <span>₹{liveDevices.reduce((sum, d) => sum + d.cost, 0).toFixed(2)}/hr</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Budget Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Monthly Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Spending</span>
                <span className="font-semibold">₹{monthlyBudget.current} / ₹{monthlyBudget.limit}</span>
              </div>
              <Progress value={budgetPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{budgetPercentage.toFixed(0)}% used</span>
                <span>{monthlyBudget.daysLeft} days left</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Projected Spending</span>
                <span className={`font-semibold ${projectedPercentage > 100 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹{monthlyBudget.projected}
                </span>
              </div>
              <Progress
                value={projectedPercentage}
                className={`h-2 ${projectedPercentage > 100 ? 'bg-red-100 dark:bg-red-900/20' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">On Track</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You're within budget
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Eco Mode</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  15.4 kg CO₂ saved
                </p>
              </div>
            </div>

            <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
              <Settings className="h-4 w-4" />
              Adjust Budget
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Energy-Saving Recommendations */}
      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Energy-Saving Recommendations
            <Badge className="ml-2 bg-amber-500">
              Save up to ₹380/month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              const priorityColors = {
                high: 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20',
                medium: 'border-yellow-300 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20',
                low: 'border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20'
              };

              return (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-2 ${priorityColors[rec.priority]} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                      <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            rec.priority === 'high'
                              ? 'border-red-400 text-red-600'
                              : rec.priority === 'medium'
                              ? 'border-yellow-400 text-yellow-600'
                              : 'border-blue-400 text-blue-600'
                          }`}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          {rec.impact}
                        </span>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          Apply
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Peak Usage Alert */}
      <Card className="border-2 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Peak Hour Alert</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You're currently using 3.7 kW during peak hours (6-10 PM). Electricity costs are 40% higher during this time.
              </p>
              <div className="flex items-center gap-3">
                <Button size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  View Peak Hours
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Set Reminders
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

