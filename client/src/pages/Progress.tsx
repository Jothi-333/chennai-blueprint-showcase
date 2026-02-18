import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Circle, Clock, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Task = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  dependencies?: string[];
};

const initialTasks: Task[] = [
  {
    id: "1",
    name: "Site Preparation & Foundation",
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    status: "completed",
    progress: 100,
  },
  {
    id: "2",
    name: "Ground Floor Construction",
    startDate: "2024-02-16",
    endDate: "2024-04-30",
    status: "completed",
    progress: 100,
    dependencies: ["1"],
  },
  {
    id: "3",
    name: "First Floor Construction",
    startDate: "2024-05-01",
    endDate: "2024-07-15",
    status: "in-progress",
    progress: 65,
    dependencies: ["2"],
  },
  {
    id: "4",
    name: "Second Floor Construction",
    startDate: "2024-07-16",
    endDate: "2024-09-30",
    status: "not-started",
    progress: 0,
    dependencies: ["3"],
  },
  {
    id: "5",
    name: "Terrace & Roofing",
    startDate: "2024-10-01",
    endDate: "2024-11-15",
    status: "not-started",
    progress: 0,
    dependencies: ["4"],
  },
  {
    id: "6",
    name: "Electrical & Plumbing",
    startDate: "2024-11-16",
    endDate: "2024-12-31",
    status: "not-started",
    progress: 0,
    dependencies: ["5"],
  },
  {
    id: "7",
    name: "Interior Finishing",
    startDate: "2025-01-01",
    endDate: "2025-03-15",
    status: "not-started",
    progress: 0,
    dependencies: ["6"],
  },
  {
    id: "8",
    name: "Final Inspection & Handover",
    startDate: "2025-03-16",
    endDate: "2025-03-31",
    status: "not-started",
    progress: 0,
    dependencies: ["7"],
  },
];

export default function Progress() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    startDate: "",
    endDate: "",
    status: "not-started",
    progress: 0,
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name || !newTask.startDate || !newTask.endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      status: newTask.status || "not-started",
      progress: newTask.progress || 0,
    };

    setTasks(prev => [...prev, task]);
    setIsAddTaskOpen(false);
    setNewTask({
      name: "",
      startDate: "",
      endDate: "",
      status: "not-started",
      progress: 0,
    });
    toast.success("Task added successfully!");
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            progress, 
            status: progress === 0 ? "not-started" : progress === 100 ? "completed" : "in-progress" 
          }
        : task
    ));
  };

  const overallProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;

  // Calculate project timeline
  const projectStart = new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())));
  const projectEnd = new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())));
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
  const today = new Date();
  const daysElapsed = Math.ceil((today.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
  const timeProgress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary font-semibold">PROJECT TRACKING</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              Project <span className="text-primary">Progress</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Track the construction timeline and milestones of Saroja Illam
            </p>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedTasks}/{tasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Progress</p>
                    <p className="text-2xl font-bold">{timeProgress.toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Overview */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Project Timeline</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {projectStart.toLocaleDateString()} - {projectEnd.toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => setIsAddTaskOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tasks.map((task) => {
                    const taskStart = new Date(task.startDate);
                    const taskEnd = new Date(task.endDate);
                    const taskDuration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
                    const startOffset = Math.ceil((taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
                    const leftPercent = (startOffset / totalDays) * 100;
                    const widthPercent = (taskDuration / totalDays) * 100;

                    return (
                      <div key={task.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : task.status === "in-progress" ? (
                              <Clock className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <h4 className="font-semibold">{task.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {taskStart.toLocaleDateString()} - {taskEnd.toLocaleDateString()} ({taskDuration} days)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold">{task.progress}%</span>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={task.progress}
                              onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </div>
                        </div>

                        {/* Gantt Bar */}
                        <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                          <div
                            className={`absolute h-full rounded-lg transition-all ${
                              task.status === "completed"
                                ? "bg-green-500"
                                : task.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-muted-foreground/30"
                            }`}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                          >
                            <div
                              className="h-full bg-white/20"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        <Progress value={task.progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Add New Task</h2>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Painting Work"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-start">Start Date</Label>
                  <Input
                    id="task-start"
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="task-end">End Date</Label>
                  <Input
                    id="task-end"
                    type="date"
                    value={newTask.endDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value: any) => setNewTask(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-progress">Progress (%)</Label>
                <Input
                  id="task-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={newTask.progress}
                  onChange={(e) => setNewTask(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

