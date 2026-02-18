import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, TrendingUp, Save, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

// Default estimated costs from the project
const defaultEstimatedCosts = {
  "Foundation & Earthwork": 450000,
  "Structural Work (RCC)": 1200000,
  "Brickwork & Masonry": 350000,
  "Plastering & Finishing": 280000,
  "Flooring & Tiling": 420000,
  "Doors & Windows": 320000,
  "Electrical Work": 250000,
  "Plumbing & Sanitary": 220000,
  "Painting": 180000,
  "Lift Installation": 400000,
  "Miscellaneous": 230000,
};

export default function Budget() {
  // Load saved data from localStorage or use defaults
  const [estimatedCosts, setEstimatedCosts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('budgetEstimatedCosts');
    return saved ? JSON.parse(saved) : defaultEstimatedCosts;
  });

  const [actualCosts, setActualCosts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('budgetActualCosts');
    return saved ? JSON.parse(saved) : {};
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleEstimatedCostChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEstimatedCosts(prev => ({
      ...prev,
      [category]: numValue
    }));
    setHasUnsavedChanges(true);
  };

  const handleActualCostChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setActualCosts(prev => ({
      ...prev,
      [category]: numValue
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('budgetEstimatedCosts', JSON.stringify(estimatedCosts));
    localStorage.setItem('budgetActualCosts', JSON.stringify(actualCosts));
    setHasUnsavedChanges(false);
    toast.success("Budget data saved successfully!");
  };

  const totalEstimated = Object.values(estimatedCosts).reduce((a, b) => a + b, 0);
  const totalActual = Object.values(actualCosts).reduce((a, b) => a + b, 0);
  const variance = totalActual - totalEstimated;
  const variancePercent = totalEstimated > 0 ? ((variance / totalEstimated) * 100).toFixed(2) : "0";

  // Prepare chart data
  const chartData = Object.keys(estimatedCosts).map(category => ({
    category: category.replace(" & ", " &\n"),
    estimated: estimatedCosts[category],
    actual: actualCosts[category] || 0,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">COST MANAGEMENT</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              Budget & <span className="text-primary">Cost Estimation</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Track actual costs against estimated budget for Saroja Illam construction
            </p>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Estimated Budget</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalEstimated)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Actual Spent</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalActual)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={variance >= 0 ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${variance >= 0 ? 'bg-red-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
                    <TrendingUp className={`h-6 w-6 ${variance >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Variance</p>
                    <p className={`text-2xl font-bold ${variance >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                    </p>
                    <p className="text-xs text-muted-foreground">({variancePercent}%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cost Input Form */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Edit2 className="h-5 w-5" />
                      Budget Management
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update estimated and actual costs for each category to track your budget
                    </p>
                  </div>
                  <Button
                    onClick={handleSave}
                    className="gap-2"
                    variant={hasUnsavedChanges ? "default" : "outline"}
                  >
                    <Save className="h-4 w-4" />
                    {hasUnsavedChanges ? "Save Changes" : "Saved"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Table Header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 pb-2 border-b font-semibold text-sm">
                    <div>Category</div>
                    <div className="text-blue-600 dark:text-blue-400">Estimated Cost</div>
                    <div className="text-orange-600 dark:text-orange-400">Actual Cost</div>
                  </div>

                  {/* Table Rows */}
                  {Object.entries(estimatedCosts).map(([category, estimated]) => (
                    <div key={category} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                      <Label htmlFor={`actual-${category}`} className="font-medium">
                        {category}
                      </Label>

                      {/* Estimated Cost Input */}
                      <div className="relative">
                        <Input
                          id={`estimated-${category}`}
                          type="number"
                          value={estimated}
                          onChange={(e) => handleEstimatedCostChange(category, e.target.value)}
                          className="border-blue-500/30 focus:border-blue-500 bg-blue-500/5"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          ₹
                        </span>
                      </div>

                      {/* Actual Cost Input */}
                      <div className="relative">
                        <Input
                          id={`actual-${category}`}
                          type="number"
                          value={actualCosts[category] || ''}
                          onChange={(e) => handleActualCostChange(category, e.target.value)}
                          className="border-orange-500/30 focus:border-orange-500 bg-orange-500/5"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          ₹
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Save Button at Bottom */}
                  <div className="pt-4 border-t flex justify-end">
                    <Button
                      onClick={handleSave}
                      size="lg"
                      className="gap-2"
                      variant={hasUnsavedChanges ? "default" : "outline"}
                    >
                      <Save className="h-4 w-4" />
                      {hasUnsavedChanges ? "Save All Changes" : "All Changes Saved"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Chart */}
      <section className="py-12 pb-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cost Comparison Chart</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visual comparison of estimated vs actual costs
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="category"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                        tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                        stroke="hsl(var(--border))"
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                        tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                        stroke="hsl(var(--border))"
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="rect"
                      />
                      <Bar
                        dataKey="estimated"
                        fill="#3b82f6"
                        name="Estimated Cost"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="actual"
                        fill="#f97316"
                        name="Actual Cost"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

