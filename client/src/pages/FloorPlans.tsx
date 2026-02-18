import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloorPlanViewer from "@/components/FloorPlanViewer";
import { Building2, CheckCircle2, Layers, Maximize2 } from "lucide-react";
import { useState } from "react";

const floorPlans = [
  {
    title: "Ground Floor",
    subtitle: "Parking & Entrance",
    image: "/images/Groundfloor.png",
    features: [
      "Building Footprint: 36'x33' (Matches Upper Floors)",
      "Wide Entrance Gate (12ft) with Clear Car Circulation",
      "2 Car Parking (9'x18' each) Side-by-Side",
      "Two-Wheeler Parking (10'x8') - 4 Bikes",
      "North-Facing Pedestrian Entrance (6' wide) Separate from Cars",
      "Lift (5'x4') + Staircase (4ft) + Electrical Room (6'x4')"
    ]
  },
  {
    title: "First Floor",
    subtitle: "2BHK - 1194 sq ft",
    image: "/images/First Floor.jpg",
    features: [
      "✓ LIFT & STAIRCASE both connect to Entrance Foyer (proper circulation)",
      "NORTHEAST: East-Facing Pooja Room (4'x4') - Vastu Ideal",
      "Children's Study Area (5'x4') with desk near Second Bedroom",
      "Master Bedroom (SW) with Balcony + Walk-in Wardrobe (dual access)",
      "Kitchen (SE) with Utility Balcony (6'x4') for washing machine",
      "Clear North arrow + Full Vastu compliance"
    ]
  },
  {
    title: "Second Floor",
    subtitle: "2BHK - 1194 sq ft",
    image: "/images/Second Floor.png",
    features: [
      "✓ COMPLETE LAYOUT - Identical to First Floor",
      "Lift & Staircase to Entrance Foyer (proper access)",
      "Northeast Pooja Room (east-facing) + Children's Study Area",
      "Master Bedroom (SW) with Balcony + Walk-in Wardrobe",
      "Kitchen with Utility Balcony (6'x4') for laundry",
      "Staircase UP TO TERRACE - Full Vastu & Functional"
    ]
  },
  {
    title: "Terrace Floor",
    subtitle: "Open Space",
    image: "/images/Terrace plan.png",
    photoImage: "/images/Terrace photorealistic Image.jpg",
    features: [
      "Open Terrace (25'x30')",
      "Open Kitchen/BBQ Area (10'x8')",
      "Sit-out Lounge (12'x10') with Pergola",
      "Washing Machine Area (4'x4')",
      "1000L Overhead Water Tank",
      "Solar Panel Mounting Area (15'x10')"
    ]
  }
];

export default function FloorPlans() {
  const [selectedFloor, setSelectedFloor] = useState<any>(null);

  const openViewer = (floor: any) => {
    setSelectedFloor(floor);
  };

  const closeViewer = () => {
    setSelectedFloor(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">ARCHITECTURAL PLANS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              Floor <span className="text-primary">Plans</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Detailed architectural layouts for Saroja Illam - A G+2 residential building with modern amenities and Vastu-compliant design
            </p>
          </div>
        </div>
      </section>

      {/* Floor Plans Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {floorPlans.map((floor, idx) => {
              // Special enhanced layout for Terrace Floor with dual images
              if (floor.title === "Terrace Floor" && floor.photoImage) {
                return (
                  <Card key={idx} className="md:col-span-2 border-border bg-card/50 overflow-hidden hover:shadow-xl transition-all group">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Floor Plan Image */}
                      <div className="relative aspect-video overflow-hidden bg-muted border-r border-border">
                        <img 
                          src={floor.image} 
                          alt={`${floor.title} - Floor Plan`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded font-mono text-xs font-semibold text-primary-foreground">
                          FLOOR PLAN
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-sm rounded font-mono text-sm font-semibold">
                          {floor.subtitle}
                        </div>
                      </div>
                      
                      {/* Photorealistic Image */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img 
                          src={floor.photoImage} 
                          alt={`${floor.title} - Photorealistic View`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded font-mono text-xs font-semibold text-primary-foreground">
                          PHOTOREALISTIC VIEW
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-display font-bold">{floor.title}</h3>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline"
                            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                            onClick={() => openViewer(floor)}
                          >
                            <Maximize2 className="h-4 w-4 mr-2" />
                            View Floor Plan
                          </Button>
                          <Button 
                            variant="outline"
                            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                            onClick={() => openViewer({ ...floor, image: floor.photoImage })}
                          >
                            <Maximize2 className="h-4 w-4 mr-2" />
                            View Photo
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {floor.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              
              // Standard layout for other floors
              return (
                <Card key={idx} className="border-border bg-card/50 overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img 
                      src={floor.image} 
                      alt={floor.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary rounded font-mono text-sm font-semibold text-primary-foreground">
                      {floor.subtitle}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-display font-bold mb-4">{floor.title}</h3>
                    <ul className="space-y-2 mb-6">
                      {floor.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                      onClick={() => openViewer(floor)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      View in Detail
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floor Plan Viewer Modal */}
      {selectedFloor && (
        <FloorPlanViewer
          isOpen={!!selectedFloor}
          onClose={closeViewer}
          floorPlan={selectedFloor}
        />
      )}
    </div>
  );
}

