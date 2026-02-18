/**
 * Design Philosophy: Bauhaus Modernism meets Indian Contemporary
 * - Deep charcoal backgrounds with saffron accents
 * - Technical precision with data visualization
 * - Clean typography with Space Grotesk and JetBrains Mono
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  Download,
  IndianRupee,
  TrendingUp,
  Building2,
  Layers
} from "lucide-react";

interface CostBreakdown {
  category: string;
  items: {
    name: string;
    unit: string;
    quantity: number;
    ratePerUnit: number;
    total: number;
  }[];
  subtotal: number;
}

export default function CostEstimator() {
  const [showDetailed, setShowDetailed] = useState(false);

  // Chennai 2024-2025 construction rates
  const costBreakdowns: CostBreakdown[] = [
    {
      category: "Ground Floor - Parking & Structure",
      items: [
        { name: "Excavation & Earthwork", unit: "cu.ft", quantity: 1200, ratePerUnit: 45, total: 54000 },
        { name: "Foundation (PCC + RCC)", unit: "cu.ft", quantity: 800, ratePerUnit: 180, total: 144000 },
        { name: "Plinth Beam & Column", unit: "cu.ft", quantity: 600, ratePerUnit: 220, total: 132000 },
        { name: "Floor Slab (6\" thick)", unit: "sq.ft", quantity: 1200, ratePerUnit: 85, total: 102000 },
        { name: "Parking Floor Finish", unit: "sq.ft", quantity: 800, ratePerUnit: 55, total: 44000 },
        { name: "Lift Installation (4 person)", unit: "unit", quantity: 1, ratePerUnit: 450000, total: 450000 },
        { name: "Electrical Work - Ground", unit: "lumpsum", quantity: 1, ratePerUnit: 75000, total: 75000 },
        { name: "Plumbing & Drainage", unit: "lumpsum", quantity: 1, ratePerUnit: 60000, total: 60000 }
      ],
      subtotal: 1061000
    },
    {
      category: "First Floor - 2BHK Unit (1194 sq.ft)",
      items: [
        { name: "RCC Columns & Beams", unit: "cu.ft", quantity: 550, ratePerUnit: 220, total: 121000 },
        { name: "Floor Slab (6\" thick)", unit: "sq.ft", quantity: 1194, ratePerUnit: 85, total: 101490 },
        { name: "Brick Masonry (9\" walls)", unit: "sq.ft", quantity: 850, ratePerUnit: 95, total: 80750 },
        { name: "Plastering (Internal + External)", unit: "sq.ft", quantity: 2400, ratePerUnit: 42, total: 100800 },
        { name: "Flooring - Vitrified Tiles", unit: "sq.ft", quantity: 900, ratePerUnit: 85, total: 76500 },
        { name: "Flooring - Wooden Laminate", unit: "sq.ft", quantity: 294, ratePerUnit: 125, total: 36750 },
        { name: "Kitchen - Modular Cabinets", unit: "running ft", quantity: 18, ratePerUnit: 8500, total: 153000 },
        { name: "Kitchen - Granite Countertop", unit: "sq.ft", quantity: 45, ratePerUnit: 350, total: 15750 },
        { name: "Bathroom Fittings & Fixtures", unit: "lumpsum", quantity: 1, ratePerUnit: 85000, total: 85000 },
        { name: "Doors - Main & Internal", unit: "units", quantity: 5, ratePerUnit: 18000, total: 90000 },
        { name: "Windows - Aluminum Frames", unit: "sq.ft", quantity: 120, ratePerUnit: 450, total: 54000 },
        { name: "Electrical Work Complete", unit: "lumpsum", quantity: 1, ratePerUnit: 95000, total: 95000 },
        { name: "Plumbing & Sanitary", unit: "lumpsum", quantity: 1, ratePerUnit: 75000, total: 75000 },
        { name: "Painting (Premium)", unit: "sq.ft", quantity: 2400, ratePerUnit: 35, total: 84000 },
        { name: "Wardrobe - Walk-in (Master)", unit: "sq.ft", quantity: 48, ratePerUnit: 650, total: 31200 },
        { name: "Balcony Railing & Finish", unit: "running ft", quantity: 16, ratePerUnit: 1200, total: 19200 }
      ],
      subtotal: 1219440
    },
    {
      category: "Second Floor - 2BHK Unit (1194 sq.ft)",
      items: [
        { name: "RCC Columns & Beams", unit: "cu.ft", quantity: 550, ratePerUnit: 220, total: 121000 },
        { name: "Floor Slab (6\" thick)", unit: "sq.ft", quantity: 1194, ratePerUnit: 85, total: 101490 },
        { name: "Brick Masonry (9\" walls)", unit: "sq.ft", quantity: 850, ratePerUnit: 95, total: 80750 },
        { name: "Plastering (Internal + External)", unit: "sq.ft", quantity: 2400, ratePerUnit: 42, total: 100800 },
        { name: "Flooring - Vitrified Tiles", unit: "sq.ft", quantity: 900, ratePerUnit: 85, total: 76500 },
        { name: "Flooring - Wooden Laminate", unit: "sq.ft", quantity: 294, ratePerUnit: 125, total: 36750 },
        { name: "Kitchen - Modular Cabinets", unit: "running ft", quantity: 18, ratePerUnit: 8500, total: 153000 },
        { name: "Kitchen - Granite Countertop", unit: "sq.ft", quantity: 45, ratePerUnit: 350, total: 15750 },
        { name: "Bathroom Fittings & Fixtures", unit: "lumpsum", quantity: 1, ratePerUnit: 85000, total: 85000 },
        { name: "Doors - Main & Internal", unit: "units", quantity: 5, ratePerUnit: 18000, total: 90000 },
        { name: "Windows - Aluminum Frames", unit: "sq.ft", quantity: 120, ratePerUnit: 450, total: 54000 },
        { name: "Electrical Work Complete", unit: "lumpsum", quantity: 1, ratePerUnit: 95000, total: 95000 },
        { name: "Plumbing & Sanitary", unit: "lumpsum", quantity: 1, ratePerUnit: 75000, total: 75000 },
        { name: "Painting (Premium)", unit: "sq.ft", quantity: 2400, ratePerUnit: 35, total: 84000 },
        { name: "Wardrobe - Walk-in (Master)", unit: "sq.ft", quantity: 48, ratePerUnit: 650, total: 31200 },
        { name: "Balcony Railing & Finish", unit: "running ft", quantity: 16, ratePerUnit: 1200, total: 19200 }
      ],
      subtotal: 1219440
    },
    {
      category: "Terrace Floor - Amenities",
      items: [
        { name: "Terrace Waterproofing", unit: "sq.ft", quantity: 750, ratePerUnit: 65, total: 48750 },
        { name: "Terrace Flooring - Anti-skid", unit: "sq.ft", quantity: 750, ratePerUnit: 75, total: 56250 },
        { name: "Parapet Wall Construction", unit: "running ft", quantity: 110, ratePerUnit: 850, total: 93500 },
        { name: "Open Kitchen - Outdoor", unit: "lumpsum", quantity: 1, ratePerUnit: 125000, total: 125000 },
        { name: "Pergola Structure", unit: "sq.ft", quantity: 80, ratePerUnit: 450, total: 36000 },
        { name: "Overhead Water Tank (1000L)", unit: "unit", quantity: 1, ratePerUnit: 35000, total: 35000 },
        { name: "Solar Panel Mounting", unit: "lumpsum", quantity: 1, ratePerUnit: 45000, total: 45000 },
        { name: "Sit-out Furniture & Planters", unit: "lumpsum", quantity: 1, ratePerUnit: 75000, total: 75000 },
        { name: "Washing Machine Area Setup", unit: "lumpsum", quantity: 1, ratePerUnit: 25000, total: 25000 },
        { name: "Outdoor Lighting", unit: "lumpsum", quantity: 1, ratePerUnit: 35000, total: 35000 }
      ],
      subtotal: 574500
    },
    {
      category: "External & Common Works",
      items: [
        { name: "External Facade - Stone Cladding", unit: "sq.ft", quantity: 400, ratePerUnit: 285, total: 114000 },
        { name: "External Painting & Texture", unit: "sq.ft", quantity: 2200, ratePerUnit: 45, total: 99000 },
        { name: "Main Entrance Gate & Canopy", unit: "lumpsum", quantity: 1, ratePerUnit: 125000, total: 125000 },
        { name: "Staircase Construction", unit: "lumpsum", quantity: 1, ratePerUnit: 185000, total: 185000 },
        { name: "Rainwater Harvesting System", unit: "lumpsum", quantity: 1, ratePerUnit: 75000, total: 75000 },
        { name: "Compound Wall & Landscaping", unit: "lumpsum", quantity: 1, ratePerUnit: 95000, total: 95000 },
        { name: "Main Electrical Panel & Meter", unit: "lumpsum", quantity: 1, ratePerUnit: 65000, total: 65000 }
      ],
      subtotal: 758000
    }
  ];

  const totalCost = costBreakdowns.reduce((sum, breakdown) => sum + breakdown.subtotal, 0);
  const contingency = totalCost * 0.10; // 10% contingency
  const professionalFees = totalCost * 0.08; // 8% architect + engineer fees
  const grandTotal = totalCost + contingency + professionalFees;

  const costPerSqFt = Math.round(grandTotal / 1194);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">Total Project Cost</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              ₹{(grandTotal / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Including contingency & fees
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/20 rounded">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">Cost per Sq.Ft</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              ₹{costPerSqFt}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Based on 1194 sq.ft per floor
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/20 rounded">
                <Building2 className="h-5 w-5 text-accent" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">Construction Area</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              3,582 sq.ft
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              G+2 floors total built-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-display font-bold text-foreground">Detailed Cost Breakdown</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Floor-wise and category-wise construction estimates
          </p>
        </div>
        <Button
          onClick={() => setShowDetailed(!showDetailed)}
          variant="outline"
          className="border-primary/30 hover:bg-primary/10"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {showDetailed ? "Hide Details" : "Show Details"}
        </Button>
      </div>

      {/* Detailed Breakdown */}
      {showDetailed && (
        <div className="space-y-6">
          {costBreakdowns.map((breakdown, idx) => (
            <Card key={idx} className="border-border bg-card/50">
              <CardHeader className="bg-primary/5 border-b border-primary/20">
                <CardTitle className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-primary" />
                  <span className="font-display">{breakdown.category}</span>
                  <span className="ml-auto text-lg font-mono text-primary">
                    ₹{(breakdown.subtotal / 100000).toFixed(2)}L
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-mono text-xs text-muted-foreground">Item</th>
                        <th className="text-right py-3 px-2 font-mono text-xs text-muted-foreground">Quantity</th>
                        <th className="text-right py-3 px-2 font-mono text-xs text-muted-foreground">Unit</th>
                        <th className="text-right py-3 px-2 font-mono text-xs text-muted-foreground">Rate (₹)</th>
                        <th className="text-right py-3 px-2 font-mono text-xs text-muted-foreground">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="py-3 px-2 text-sm">{item.name}</td>
                          <td className="py-3 px-2 text-right font-mono text-sm">{item.quantity.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right font-mono text-sm text-muted-foreground">{item.unit}</td>
                          <td className="py-3 px-2 text-right font-mono text-sm">{item.ratePerUnit.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right font-mono text-sm font-semibold">{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary Table */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">Subtotal (Construction)</span>
                  <span className="font-mono font-semibold">₹{totalCost.toLocaleString()}</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">Contingency (10%)</span>
                  <span className="font-mono font-semibold">₹{contingency.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">Professional Fees (8%)</span>
                  <span className="font-mono font-semibold">₹{professionalFees.toLocaleString()}</span>
                </div>
                <Separator className="bg-primary/30" />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-display text-lg font-bold">Grand Total</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-center font-mono mt-2">
                  * Rates based on Chennai market prices (2024-2025) • Subject to material availability
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Download Button */}
          <div className="flex justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="h-5 w-5 mr-2" />
              Download Detailed Budget Sheet (PDF)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
