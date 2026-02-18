/**
 * Chennai Blueprint Showcase - Home Page
 * Design: Bauhaus Modernism meets Indian Contemporary
 * - Deep charcoal backgrounds with saffron accents
 * - Geometric precision with diagonal cuts
 * - Blueprint grid overlays
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FloorPlanViewer from "@/components/FloorPlanViewer";
import CostEstimator from "@/components/CostEstimator";
import FloorPlanUploader from "@/components/FloorPlanUploader";
import EditableFloorPlan from "@/components/EditableFloorPlan";
import HybridFloorPlanEditor from "@/components/HybridFloorPlanEditor";
import { firstFloorPlan } from "@/data/floorPlanData";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Building2, 
  Car, 
  Home as HomeIcon, 
  Layers, 
  Ruler, 
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Maximize2,
  IndianRupee,
  Upload,
  Edit3,
  Sparkles
} from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ image: string; title: string; subtitle: string } | null>(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [vectorEditorMode, setVectorEditorMode] = useState(false);
  const [hybridEditorMode, setHybridEditorMode] = useState(false);
  const [customFloorPlans, setCustomFloorPlans] = useState<{[key: string]: string}>({});

  const openViewer = (plan: { image: string; title: string; subtitle: string }) => {
    setSelectedPlan(plan);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setTimeout(() => setSelectedPlan(null), 300);
  };

  const handleImageUpdate = (floorTitle: string, newImageUrl: string) => {
    setCustomFloorPlans(prev => ({
      ...prev,
      [floorTitle]: newImageUrl
    }));
  };

  const getFloorPlanImage = (floor: any) => {
    return customFloorPlans[floor.title] || floor.image;
  };

  const floorPlans = [
    {
      title: "Ground Floor",
      subtitle: "Parking & Entrance",
      image: "/images/Groundfloor.png",
      features: ["Building Footprint: 36'x33' (Matches Upper Floors)", "Wide Entrance Gate (12ft) with Clear Car Circulation", "2 Car Parking (9'x18' each) Side-by-Side", "Two-Wheeler Parking (10'x8') - 4 Bikes", "North-Facing Pedestrian Entrance (6' wide) Separate from Cars", "Lift (5'x4') + Staircase (4ft) + Electrical Room (6'x4')"]
    },
    {
      title: "First Floor",
      subtitle: "2BHK - 1194 sq ft",
      image: "/images/First Floor.jpg",
      features: ["✓ LIFT & STAIRCASE both connect to Entrance Foyer (proper circulation)", "NORTHEAST: East-Facing Pooja Room (4'x4') - Vastu Ideal", "Children's Study Area (5'x4') with desk near Second Bedroom", "Master Bedroom (SW) with Balcony + Walk-in Wardrobe (dual access)", "Kitchen (SE) with Utility Balcony (6'x4') for washing machine", "Clear North arrow + Full Vastu compliance"]
    },
    {
      title: "Second Floor",
      subtitle: "2BHK - 1194 sq ft",
      image: "/images/Second Floor.png",
      features: ["✓ COMPLETE LAYOUT - Identical to First Floor", "Lift & Staircase to Entrance Foyer (proper access)", "Northeast Pooja Room (east-facing) + Children's Study Area", "Master Bedroom (SW) with Balcony + Walk-in Wardrobe", "Kitchen with Utility Balcony (6'x4') for laundry", "Staircase UP TO TERRACE - Full Vastu & Functional"]
    },
    {
      title: "Terrace Floor",
      subtitle: "Open Space",
      image: "/images/Terrace plan.png",
      features: ["Open Terrace (25'x30')", "Open Kitchen/BBQ Area (10'x8')", "Sit-out Lounge (12'x10') with Pergola", "Washing Machine Area (4'x4')", "1000L Overhead Water Tank", "Solar Panel Mounting Area (15'x10')"]
    }
  ];

  const specifications = [
    { icon: Building2, label: "Building Type", value: "G+2 Residential" },
    { icon: Ruler, label: "Total Built-up", value: "3582 sq ft" },
    { icon: Layers, label: "Floors", value: "Ground + 2 Floors + Terrace" },
    { icon: MapPin, label: "Location", value: "Chennai, Tamil Nadu" },
    { icon: Car, label: "Parking", value: "2 Cars + 4-5 Two-wheelers" },
    { icon: HomeIcon, label: "Units", value: "2 x 2BHK (1194 sq ft each)" }
  ];

  const compliance = [
    "Chennai Building Bye-laws 2025 Compliant",
    "FSI: 1.32 (within 1.62 limit)",
    "Setbacks: Front 1.5-3m, Sides 1-1.5m, Rear 1.5m",
    "Mandatory Rainwater Harvesting System",
    "Universal Accessibility (Lift Included)",
    "Fire Safety Norms Compliant"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-background to-primary/5 blueprint-grid overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded mb-6">
                <span className="text-sm font-mono text-primary font-semibold tracking-wide">ARCHITECTURAL BLUEPRINT</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                Modern 2BHK House<br />
                <span className="text-primary">Chennai</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                A comprehensive architectural blueprint for a G+2 residential building featuring modern amenities, 
                north-facing entrance, and complete compliance with Chennai building regulations.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={() => openViewer(floorPlans[1])}
                >
                  Explore Interactive Plans
                  <Maximize2 className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                  Download Specifications
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {floorPlans.slice(0, 4).map((plan, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-square rounded border-2 border-primary/20 overflow-hidden cursor-pointer hover:border-primary/60 transition-all group"
                    onClick={() => openViewer(plan)}
                  >
                    <img 
                      src={plan.image} 
                      alt={plan.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-3">
                      <span className="text-xs font-mono font-semibold text-foreground">{plan.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Grid */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specifications.map((spec, idx) => (
              <Card key={idx} className="border-border bg-card/50 hover:bg-card transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-3">
                    <spec.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">{spec.label}</p>
                  <p className="text-sm font-semibold text-foreground">{spec.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Plans Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">FLOOR PLANS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Detailed <span className="text-primary">Architectural Layouts</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional CAD-quality floor plans with precise dimensions, furniture layouts, and technical specifications
            </p>
          </div>

          <div className="mb-8 flex justify-end gap-3 flex-wrap">
            <Button 
              onClick={() => {
                setHybridEditorMode(!hybridEditorMode);
                if (!hybridEditorMode) {
                  setVectorEditorMode(false);
                  setUploadMode(false);
                }
              }}
              variant={hybridEditorMode ? "default" : "outline"}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {hybridEditorMode ? "Hide AI Editor" : "AI-Assisted Editor"}
            </Button>
            <Button 
              onClick={() => {
                setVectorEditorMode(!vectorEditorMode);
                if (!vectorEditorMode) setHybridEditorMode(false);
              }}
              variant={vectorEditorMode ? "default" : "outline"}
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {vectorEditorMode ? "Hide Vector Editor" : "Edit Vector Floor Plan"}
            </Button>
            <Button 
              onClick={() => {
                setUploadMode(!uploadMode);
                if (!uploadMode) setHybridEditorMode(false);
              }}
              variant={uploadMode ? "default" : "outline"}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploadMode ? "Hide Upload Panel" : "Upload Custom Floor Plans"}
            </Button>
          </div>

          {hybridEditorMode && (
            <div className="mb-12">
              <HybridFloorPlanEditor />
            </div>
          )}

          {vectorEditorMode && (
            <div className="mb-12">
              <EditableFloorPlan 
                initialPlan={firstFloorPlan}
                title="First Floor"
              />
            </div>
          )}

          {uploadMode && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {floorPlans.map((floor, idx) => (
                <FloorPlanUploader
                  key={idx}
                  floorName={floor.title}
                  currentImage={getFloorPlanImage(floor)}
                  onImageUpdate={(newImageUrl) => handleImageUpdate(floor.title, newImageUrl)}
                />
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {floorPlans.map((floor, idx) => (
              <Card key={idx} className="border-border bg-card/50 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img 
                    src={getFloorPlanImage(floor)} 
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
                        <span>{feature}</span>
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
            ))}
          </div>
        </div>
      </section>

      {/* Cost Estimation Section */}
      <section className="py-20 bg-card/30 diagonal-cut-top">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">COST ESTIMATION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Project Budget & <span className="text-primary">Cost Breakdown</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive construction cost analysis with floor-wise breakdown and material specifications
            </p>
          </div>

          <CostEstimator />
        </div>
      </section>

      {/* Building Elevations Section */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">BUILDING ELEVATIONS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Modern Architectural Style
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contemporary facade design with stone cladding, aluminum windows, and functional elements
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="border-primary/30 bg-card overflow-hidden">
              <div className="relative aspect-video bg-background">
                <img 
                  src="https://private-us-east-1.manuscdn.com/sessionFile/U2AefyUXrt7IXb0pS6fDA6/sandbox/PVjq2b5rGkXRllYRIvjBg6-img-5_1771342600000_na1fn_YnVpbGRpbmdfZWxldmF0aW9uX2Zyb250.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVTJBZWZ5VVhydDdJWGIwcFM2ZkRBNi9zYW5kYm94L1BWanEyYjVyR2tYUmxsWVJJdmpCZzYtaW1nLTVfMTc3MTM0MjYwMDAwMF9uYTFmbl9ZblZwYkdScGJtZGZaV3hsZG1GMGFXOXVYMlp5YjI1MC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oCSlBaqe1P9a4otxc6hdJznL8thPw4WYfCqLhs2WLCUGSfw3Vwr2L7Sa304AJImIpT8mjZFNfeENVKAQ-44piupHxzoWlagj0PZoGOFnGI~Vp7SlKNH7supLokczkSKG3nf--9WN~trc15PtRAiugvy~Z1od-ehCuAIwAyEJdQ9x4EiG0X3hblzBFj1D8sSUtouhhpGNYkT9SF3jG~yI9YGn-vSTLpZXQsX0CtvvSIKmrcv5f6HKgm6MJ3AFy-QLPFmjIoEtwObDqq441dJkWfnzJifRzUc6wCdx8OnAq-QWt1cX3ZQdcP3pbsT~pxCwt72gsfu4PCDnhug8xjctKA__"
                  alt="North Elevation - Front View"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6 bg-card/50">
                <h3 className="text-xl font-display font-bold mb-3">North Elevation (Front View)</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Natural stone cladding (gray granite) on accent walls</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Aluminum window frames (5'x4') with grills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Decorative sunshade louvers above windows</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Modern entrance canopy with geometric pattern</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Total building height: 33 feet (10ft per floor)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Textured paint finish (light beige #F5F5DC)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  Chennai Building Compliance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fully compliant with CMDA regulations and building bye-laws
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {compliance.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-card/50 rounded border border-border">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Floor Plan Viewer */}
      {selectedPlan && (
        <FloorPlanViewer
          image={selectedPlan.image}
          title={selectedPlan.title}
          subtitle={selectedPlan.subtitle}
          isOpen={viewerOpen}
          onClose={closeViewer}
        />
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/30">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-mono">
            Modern 2BHK House - Chennai | Professional Architectural Blueprint
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 All Rights Reserved | Designed for Chennai Climate & Regulations
          </p>
        </div>
      </footer>
    </div>
  );
}
