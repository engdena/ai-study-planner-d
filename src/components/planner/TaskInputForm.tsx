import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarIcon, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, WorkIntensity, WORK_INTENSITY_LABELS } from "@/types/studyPlanner";
import { cn } from "@/lib/utils";

interface TaskInputFormProps {
  onAddTask: (task: Omit<Task, "id">) => void;
  embedded?: boolean;
}

const TaskInputForm = ({ onAddTask, embedded = false }: TaskInputFormProps) => {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [priority, setPriority] = useState(3);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [workIntensity, setWorkIntensity] = useState<WorkIntensity>("deep");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !deadline) return;
    onAddTask({
      subject: subject.trim(),
      difficulty,
      priority,
      deadline,
      workIntensity,
    });
    setSubject("");
    setDifficulty(3);
    setPriority(3);
    setDeadline(undefined);
    setWorkIntensity("deep");
  };

  const getDifficultyLabel = (v: number) =>
    ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"][v - 1];
  const getPriorityLabel = (v: number) =>
    ["Low", "Below Average", "Medium", "High", "Critical"][v - 1];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={embedded ? "" : "card-elevated p-6"}
    >
      {!embedded && (
        <h3 className="text-sm font-semibold text-foreground mb-5 tracking-tight flex items-center gap-2">
          <Plus className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          Add New Task
        </h3>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject / Task Name
          </Label>
          <Input
            id="subject"
            type="text"
            placeholder="e.g., Mathematics, Physics Lab"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full"
            required
          />
        </div>

        {/* Work Intensity */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Work Intensity
          </Label>
          <Select
            value={workIntensity}
            onValueChange={(v) => setWorkIntensity(v as WorkIntensity)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deep">Deep Work</SelectItem>
              <SelectItem value="admin">Administrative</SelectItem>
              <SelectItem value="review">Review</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            {WORK_INTENSITY_LABELS[workIntensity]} —{" "}
            {workIntensity === "deep"
              ? "high-focus, cognitively demanding"
              : workIntensity === "admin"
              ? "low-focus, repetitive tasks"
              : "consolidation and recall"}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Difficulty</Label>
            <span className="text-xs text-foreground font-medium tabular-nums">
              {difficulty} · {getDifficultyLabel(difficulty)}
            </span>
          </div>
          <Slider
            value={[difficulty]}
            onValueChange={(v) => setDifficulty(v[0])}
            min={1}
            max={5}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Priority</Label>
            <span className="text-xs text-foreground font-medium tabular-nums">
              {priority} · {getPriorityLabel(priority)}
            </span>
          </div>
          <Slider
            value={[priority]}
            onValueChange={(v) => setPriority(v[0])}
            min={1}
            max={5}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Critical</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Deadline
          </Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !deadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "MMMM d, yyyy") : "Select deadline date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={(d) => {
                  setDeadline(d);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => date < today}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 5}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          className="w-full btn-primary"
          disabled={!subject.trim() || !deadline}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </form>
    </motion.div>
  );
};

export default TaskInputForm;
