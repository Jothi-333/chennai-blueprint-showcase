import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Image as ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Photo = {
  id: string;
  url: string;
  title: string;
  phase: string;
  date: string;
  description?: string;
};

const phases = [
  "Foundation",
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Terrace",
  "Finishing",
  "Completed"
];

// Sample photos (you can replace with actual construction photos)
const samplePhotos: Photo[] = [
  {
    id: "1",
    url: "/images/Groundfloor.png",
    title: "Ground Floor Layout",
    phase: "Ground Floor",
    date: "2024-01-15",
    description: "Initial ground floor construction"
  },
  {
    id: "2",
    url: "/images/First Floor.jpg",
    title: "First Floor Plan",
    phase: "First Floor",
    date: "2024-02-20",
    description: "First floor structure completion"
  },
  {
    id: "3",
    url: "/images/Second Floor.png",
    title: "Second Floor Layout",
    phase: "Second Floor",
    date: "2024-03-10",
    description: "Second floor construction progress"
  },
  {
    id: "4",
    url: "/images/Terrace plan.png",
    title: "Terrace Floor",
    phase: "Terrace",
    date: "2024-04-05",
    description: "Terrace floor development"
  },
];

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    phase: "",
    date: "",
    description: "",
    file: null as File | null,
  });

  const filteredPhotos = selectedPhase === "all" 
    ? photos 
    : photos.filter(p => p.phase === selectedPhase);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error("Please select a photo to upload");
      return;
    }

    // Create a URL for the uploaded file
    const url = URL.createObjectURL(uploadForm.file);
    
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url,
      title: uploadForm.title,
      phase: uploadForm.phase,
      date: uploadForm.date,
      description: uploadForm.description,
    };

    setPhotos(prev => [newPhoto, ...prev]);
    setIsUploadOpen(false);
    setUploadForm({
      title: "",
      phase: "",
      date: "",
      description: "",
      file: null,
    });
    toast.success("Photo uploaded successfully!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">CONSTRUCTION GALLERY</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              Project <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Follow the construction journey of Saroja Illam through photos
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Upload */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Label htmlFor="phase-filter">Filter by Phase:</Label>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Phases" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phases.map(phase => (
                    <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>

          {/* Photo Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map(photo => (
              <Card 
                key={photo.id} 
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{photo.title}</h3>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{photo.phase}</span>
                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No photos found for this phase</p>
            </div>
          )}
        </div>
      </section>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Upload Photo</h2>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="photo-file">Photo</Label>
                <Input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo-title">Title</Label>
                <Input
                  id="photo-title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Foundation Work Progress"
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo-phase">Construction Phase</Label>
                <Select
                  value={uploadForm.phase}
                  onValueChange={(value) => setUploadForm(prev => ({ ...prev, phase: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map(phase => (
                      <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="photo-date">Date</Label>
                <Input
                  id="photo-date"
                  type="date"
                  value={uploadForm.date}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo-description">Description (Optional)</Label>
                <Input
                  id="photo-description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details about this photo..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">{selectedPhoto.title}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded">{selectedPhoto.phase}</span>
                  <span>{new Date(selectedPhoto.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                {selectedPhoto.description && (
                  <p className="text-muted-foreground">{selectedPhoto.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

