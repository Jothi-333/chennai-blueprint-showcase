// Construction Progress Tracker for Saroja Illam
// Tracks construction phases, budget, timeline, and milestones

export type ConstructionStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'delayed';

export interface BudgetInfo {
  allocated: number; // in INR
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export interface ConstructionPhase {
  id: string;
  name: string;
  description: string;
  status: ConstructionStatus;
  budget: BudgetInfo;
  startDate?: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  notes: string[];
  contractor?: string;
  dependencies?: string[]; // IDs of phases that must complete first
}

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
  completionDate?: Date;
  notes?: string;
}

// Saroja Illam Construction Database
const SAROJA_ILLAM_PHASES: Record<string, ConstructionPhase> = {
  foundation: {
    id: 'foundation',
    name: 'Foundation & Basement',
    description: 'Excavation, foundation laying, and basement construction',
    status: 'completed',
    budget: {
      allocated: 500000,
      spent: 480000,
      remaining: 20000,
      percentageUsed: 96
    },
    startDate: new Date('2024-01-15'),
    expectedCompletionDate: new Date('2024-03-01'),
    actualCompletionDate: new Date('2024-02-28'),
    progress: 100,
    milestones: [
      { id: 'f1', name: 'Site excavation', completed: true, completionDate: new Date('2024-01-20') },
      { id: 'f2', name: 'Foundation concrete', completed: true, completionDate: new Date('2024-02-10') },
      { id: 'f3', name: 'Basement waterproofing', completed: true, completionDate: new Date('2024-02-28') }
    ],
    notes: ['Foundation is strong and well-built', 'Waterproofing done with premium materials'],
    contractor: 'Chennai Builders Ltd'
  },
  
  groundFloor: {
    id: 'groundFloor',
    name: 'Ground Floor - Parking',
    description: 'Ground floor construction with 2-car parking and entrance',
    status: 'completed',
    budget: {
      allocated: 800000,
      spent: 750000,
      remaining: 50000,
      percentageUsed: 93.75
    },
    startDate: new Date('2024-03-01'),
    expectedCompletionDate: new Date('2024-05-15'),
    actualCompletionDate: new Date('2024-05-10'),
    progress: 100,
    milestones: [
      { id: 'g1', name: 'Column & beam work', completed: true, completionDate: new Date('2024-03-20') },
      { id: 'g2', name: 'Slab casting', completed: true, completionDate: new Date('2024-04-10') },
      { id: 'g3', name: 'Parking area flooring', completed: true, completionDate: new Date('2024-05-10') }
    ],
    notes: ['Parking can accommodate 2 cars + 4 bikes', 'Lift shaft completed'],
    contractor: 'Chennai Builders Ltd',
    dependencies: ['foundation']
  },

  firstFloor: {
    id: 'firstFloor',
    name: 'First Floor - 2BHK (1194 sq ft)',
    description: 'First floor residential unit with 2 bedrooms, hall, kitchen',
    status: 'in-progress',
    budget: {
      allocated: 1200000,
      spent: 850000,
      remaining: 350000,
      percentageUsed: 70.83
    },
    startDate: new Date('2024-05-15'),
    expectedCompletionDate: new Date('2024-09-01'),
    progress: 75,
    milestones: [
      { id: 'f1_1', name: 'Structural work', completed: true, completionDate: new Date('2024-06-15') },
      { id: 'f1_2', name: 'Plumbing & electrical', completed: true, completionDate: new Date('2024-07-20') },
      { id: 'f1_3', name: 'Plastering & flooring', completed: false },
      { id: 'f1_4', name: 'Kitchen & bathroom fittings', completed: false },
      { id: 'f1_5', name: 'Painting & finishing', completed: false }
    ],
    notes: ['Electrical wiring completed', 'Plumbing rough-in done', 'Waiting for tiles delivery'],
    contractor: 'Chennai Builders Ltd',
    dependencies: ['groundFloor']
  },

  secondFloor: {
    id: 'secondFloor',
    name: 'Second Floor - 2BHK (1194 sq ft)',
    description: 'Second floor residential unit (identical to first floor)',
    status: 'not-started',
    budget: {
      allocated: 1200000,
      spent: 0,
      remaining: 1200000,
      percentageUsed: 0
    },
    expectedCompletionDate: new Date('2025-01-15'),
    progress: 0,
    milestones: [
      { id: 'f2_1', name: 'Structural work', completed: false },
      { id: 'f2_2', name: 'Plumbing & electrical', completed: false },
      { id: 'f2_3', name: 'Plastering & flooring', completed: false },
      { id: 'f2_4', name: 'Kitchen & bathroom fittings', completed: false },
      { id: 'f2_5', name: 'Painting & finishing', completed: false }
    ],
    notes: ['Will start after first floor completion'],
    contractor: 'Chennai Builders Ltd',
    dependencies: ['firstFloor']
  },

  terrace: {
    id: 'terrace',
    name: 'Terrace Floor - Open Space',
    description: 'Terrace with BBQ area, sit-out, solar panels, water tank',
    status: 'not-started',
    budget: {
      allocated: 400000,
      spent: 0,
      remaining: 400000,
      percentageUsed: 0
    },
    expectedCompletionDate: new Date('2025-03-01'),
    progress: 0,
    milestones: [
      { id: 't1', name: 'Terrace waterproofing', completed: false },
      { id: 't2', name: 'Pergola construction', completed: false },
      { id: 't3', name: 'BBQ area setup', completed: false },
      { id: 't4', name: 'Solar panel installation', completed: false },
      { id: 't5', name: 'Water tank installation', completed: false }
    ],
    notes: ['Jyothi is working on the terrace floor plan', 'Solar panel area: 15x10 ft'],
    dependencies: ['secondFloor']
  }
};

/**
 * Get all construction phases
 */
export function getAllPhases(): ConstructionPhase[] {
  return Object.values(SAROJA_ILLAM_PHASES);
}

/**
 * Get specific phase by ID
 */
export function getPhase(phaseId: string): ConstructionPhase | null {
  return SAROJA_ILLAM_PHASES[phaseId] || null;
}

/**
 * Get overall project progress
 */
export function getOverallProgress(): {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentageComplete: number;
  phasesCompleted: number;
  totalPhases: number;
} {
  const phases = getAllPhases();
  const totalBudget = phases.reduce((sum, p) => sum + p.budget.allocated, 0);
  const totalSpent = phases.reduce((sum, p) => sum + p.budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const phasesCompleted = phases.filter(p => p.status === 'completed').length;
  const totalPhases = phases.length;
  const percentageComplete = Math.round((phasesCompleted / totalPhases) * 100);

  return {
    totalBudget,
    totalSpent,
    totalRemaining,
    percentageComplete,
    phasesCompleted,
    totalPhases
  };
}

// Save to localStorage
const STORAGE_KEY = 'saroja_illam_construction';

export function saveProgress(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAROJA_ILLAM_PHASES));
}

export function loadProgress(): void {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(SAROJA_ILLAM_PHASES, data);
  }
}

