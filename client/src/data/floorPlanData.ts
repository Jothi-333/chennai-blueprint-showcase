// Floor plan data extracted from the architectural drawings
// Coordinates are in feet, origin at top-left

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
}

export interface Door {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number; // degrees
  type: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7';
}

export interface Window {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
}

export interface FloorPlan {
  totalWidth: number;
  totalHeight: number;
  rooms: Room[];
  doors: Door[];
  windows: Window[];
}

export const firstFloorPlan: FloorPlan = {
  totalWidth: 36,
  totalHeight: 33,
  rooms: [
    // Left side - Children's Study Area (Room A - Top)
    {
      id: 'room-a-top',
      name: 'Room A',
      x: 0,
      y: 0,
      width: 5.33,
      height: 6,
      color: '#D4B896',
      label: 'Room A\n5\'x6\''
    },
    // Walk-in Wardrobe
    {
      id: 'walk-in-wardrobe',
      name: 'Walk-in Wardrobe',
      x: 0,
      y: 6,
      width: 5.33,
      height: 6,
      color: '#E8D4B8',
      label: 'WALK-IN\nWARDROBE\n5\'x6\''
    },
    // Master Bathroom
    {
      id: 'master-bathroom',
      name: 'Master Bathroom',
      x: 0,
      y: 12,
      width: 8.67,
      height: 6,
      color: '#F4C2D8',
      label: 'MASTER\nBATHROOM\n8\'x6\''
    },
    // Room A Bottom
    {
      id: 'room-a-bottom',
      name: 'Room A',
      x: 0,
      y: 18,
      width: 5.33,
      height: 6,
      color: '#D4B896',
      label: 'Room A\n5\'x6\''
    },
    // Second Bedroom
    {
      id: 'second-bedroom',
      name: 'Second Bedroom',
      x: 5.33,
      y: 0,
      width: 12.2,
      height: 12,
      color: '#A8C8E8',
      label: 'SECOND BEDROOM\n12\'x12\''
    },
    // Master Bedroom
    {
      id: 'master-bedroom',
      name: 'Master Bedroom',
      x: 5.33,
      y: 12,
      width: 14.84,
      height: 14,
      color: '#A8C8E8',
      label: 'MASTER BEDROOM\n14\'x14\''
    },
    // Balcony
    {
      id: 'balcony',
      name: 'Balcony',
      x: 20.17,
      y: 18,
      width: 6.33,
      height: 4,
      color: '#E8D4A8',
      label: 'BALCONY\n8\'x4\''
    },
    // Common Toilet
    {
      id: 'common-toilet',
      name: 'Common Toilet',
      x: 20.17,
      y: 22,
      width: 6.33,
      height: 6,
      color: '#F4E8D8',
      label: 'COMMON\nTOILET\n5\'x6\''
    },
    // Living & Dining
    {
      id: 'living-dining',
      name: 'Living & Dining',
      x: 17.53,
      y: 0,
      width: 23,
      height: 16,
      color: '#F4F0C8',
      label: 'LIVING & DINING\n18\'x16\''
    },
    // Kitchen
    {
      id: 'kitchen',
      name: 'Kitchen',
      x: 26.5,
      y: 16,
      width: 12,
      height: 10,
      color: '#C8E8C8',
      label: 'KITCHEN\n12\'x10\''
    },
    // Kitchen Utility Balcony
    {
      id: 'utility-balcony',
      name: 'Utility Balcony',
      x: 26.5,
      y: 26,
      width: 6.33,
      height: 4,
      color: '#D8E8D8',
      label: 'BALCONY\n6\'x4\''
    },
    // Entrance Foyer
    {
      id: 'entrance-foyer',
      name: 'Entrance Foyer',
      x: 29,
      y: 0,
      width: 5,
      height: 6,
      color: '#E8E8D8',
      label: 'ENTRANCE D1\nFOYER\n5\'x6\''
    },
    // Pooja Room
    {
      id: 'pooja-room',
      name: 'Pooja Room',
      x: 31,
      y: 6,
      width: 4,
      height: 4,
      color: '#F4D8A8',
      label: 'POOJA\nROOM\n4\'x4\''
    },
    // Wash Basin area
    {
      id: 'wash-basin',
      name: 'Wash Basin',
      x: 29,
      y: 10,
      width: 6,
      height: 6,
      color: '#E8E8E8',
      label: 'Wash\nBasin\n1\'x6\''
    },
    // Lift
    {
      id: 'lift',
      name: 'Lift',
      x: 23,
      y: 0,
      width: 5,
      height: 4,
      color: '#C8C8C8',
      label: '5\'x4\'\nLIFT'
    }
  ],
  doors: [
    { id: 'd1-1', x: 17.5, y: 8, width: 2.5, rotation: 0, type: 'D1' },
    { id: 'd1-2', x: 20, y: 12, width: 2.5, rotation: 90, type: 'D1' },
    { id: 'd1-3', x: 26, y: 18, width: 2.5, rotation: 0, type: 'D1' },
    { id: 'd1-4', x: 29, y: 6, width: 2.5, rotation: 90, type: 'D1' },
    { id: 'd1-5', x: 31, y: 10, width: 2.5, rotation: 0, type: 'D1' },
    { id: 'd3', x: 5, y: 17, width: 2.25, rotation: 0, type: 'D3' },
    { id: 'd5', x: 3, y: 12, width: 1.83, rotation: 90, type: 'D5' },
    { id: 'd6', x: 5, y: 5, width: 2, rotation: 90, type: 'D6' }
  ],
  windows: []
};
