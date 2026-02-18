import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Estimated costs from the project
const estimatedCosts = {
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

const totalEstimated = Object.values(estimatedCosts).reduce((a, b) => a + b, 0);

export default function Budget() {
  const [actualCosts, setActualCosts] = useState<Record<string, number>>({});

  const handleCostChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setActualCosts(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const totalActual = Object.values(actualCosts).reduce((a, b) => a + b, 0);
  const variance = totalActual - totalEstimated;
  const variancePercent = totalEstimated > 0 ? ((variance / totalEstimated) * 100).toFixed(2) : "0";

  // Prepare chart data
  const chartData = Object.keys(estimatedCosts).map(category => ({
    category: category.replace(" & ", " &\n"),
    estimated: estimatedCosts[category as keyof typeof estimatedCosts],
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalEstimated)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Actual Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalActual)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${variance >= 0 ? 'bg-red-500/10' : 'bg-green-500/10'} flex items-center justify-center`}>
                    <TrendingUp className={`h-6 w-6 ${variance >= 0 ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Variance</p>
                    <p className={`text-2xl font-bold ${variance >= 0 ? 'text-red-500' : 'text-green-500'}`}>
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
                <CardTitle className="text-2xl">Enter Actual Costs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update the actual costs for each category to track your budget
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(estimatedCosts).map(([category, estimated]) => (
                    <div key={category} className="space-y-2">
                      <Label htmlFor={category}>{category}</Label>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            id={category}
                            type="number"
                            placeholder={`Estimated: ${formatCurrency(estimated)}`}
                            value={actualCosts[category] || ''}
                            onChange={(e) => handleCostChange(category, e.target.value)}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          Est: {formatCurrency(estimated)}
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="category"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="estimated" fill="hsl(var(--primary))" name="Estimated" />
                      <Bar dataKey="actual" fill="hsl(142 76% 36%)" name="Actual" />
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

