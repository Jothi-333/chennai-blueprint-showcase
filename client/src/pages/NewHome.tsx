import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Heart, Home, Users } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NewHome() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Tribute to Saroja Ammal */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Memorial Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">IN LOVING MEMORY</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Saroja Illam
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
              A Home Built with Love, Dedicated to{" "}
              <span className="text-primary font-semibold">Saroja Ammal</span>
            </p>

            {/* Tribute Text */}
            <div className="max-w-3xl mx-auto mb-12">
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    This home is a heartfelt tribute to <strong className="text-foreground">Saroja Ammal</strong>, 
                    the beloved grandmother of Mr. Gunasekaran and Mrs. Aswini, and the cherished mother of 
                    Maha Lakshmi.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Saroja Ammal was a pillar of strength, love, and wisdom in our family. Her warmth, 
                    kindness, and unwavering support touched the lives of everyone who knew her. She taught 
                    us the values of family, compassion, and resilience.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Though she left us in <strong className="text-foreground">2020</strong>, her spirit lives 
                    on in every corner of this home. Saroja Illam stands as a testament to her legacy—a place 
                    where family gathers, memories are made, and her love continues to guide us.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/floor-plans">
                <Button size="lg" className="gap-2">
                  <Building2 className="h-5 w-5" />
                  Explore Floor Plans
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="gap-2">
                  <Home className="h-5 w-5" />
                  View Gallery
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Family Tree Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">FAMILY LEGACY</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our <span className="text-primary">Family Tree</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three generations united by love, building a home for the future
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Saroja Ammal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2">Saroja Ammal</h3>
                    <p className="text-sm text-muted-foreground mb-2">Matriarch</p>
                    <p className="text-xs text-muted-foreground italic">1920 - 2020</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      The foundation of our family, whose love and wisdom guide us always
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Maha Lakshmi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2">Maha Lakshmi</h3>
                    <p className="text-sm text-muted-foreground mb-2">Daughter</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Carrying forward the values and traditions of Saroja Ammal
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Grandchildren */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Home className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2">Gunasekaran & Aswini</h3>
                    <p className="text-sm text-muted-foreground mb-2">Grandchildren</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Building Saroja Illam to honor their grandmother's legacy
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">PROJECT DETAILS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              About <span className="text-primary">Saroja Illam</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A modern G+2 residential building designed with love and built with precision
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-4">Building Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Building Type</span>
                    <span className="font-semibold">G+2 Residential</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Total Built-up Area</span>
                    <span className="font-semibold">3,582 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Plot Size</span>
                    <span className="font-semibold">36' × 33'</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Floors</span>
                    <span className="font-semibold">Ground + 2 Floors + Terrace</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Configuration</span>
                    <span className="font-semibold">2BHK per floor</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold">Chennai, Tamil Nadu</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-4">Key Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-muted-foreground">Vastu-compliant design with north-facing entrance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-muted-foreground">Modern amenities including lift and spacious parking</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-muted-foreground">Eco-friendly features with solar panel provisions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-muted-foreground">Rooftop terrace with BBQ area and sit-out lounge</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-muted-foreground">Optimized for natural light and ventilation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-muted-foreground">Compliant with Chennai building regulations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/floor-plans">
              <Button size="lg" className="gap-2">
                <Building2 className="h-5 w-5" />
                View Detailed Floor Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Follow Our Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Watch as Saroja Illam comes to life, brick by brick, with love and dedication
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/progress">
                <Button size="lg" variant="default">
                  View Project Progress
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline">
                  Construction Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

