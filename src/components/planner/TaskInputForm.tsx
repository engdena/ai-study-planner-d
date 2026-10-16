import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarIcon } from "lucide-react";
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
import { Task } from "@/types/studyPlanner";
import { cn } from "@/lib/utils";

interface TaskInputFormProps {
  onAddTask: (task: Omit<Task, "id">) => void;
}

const TaskInputForm = ({ onAddTask }: TaskInputFormProps) => {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [priority, setPriority] = useState(3);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !deadline) return;

    onAddTask({
      subject: subject.trim(),
      difficulty,
      priority,
      deadline: deadline,
    });

    // Reset form
    setSubject("");
    setDifficulty(3);
    setPriority(3);
    setDeadline(undefined);
  };

  const getDifficultyLabel = (value: number) => {
    const labels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
    return labels[value - 1];
  };

  const getPriorityLabel = (value: number) => {
    const labels = ["Low", "Below Average", "Medium", "High", "Critical"];
    return labels[value - 1];
  };

  // Get minimum date (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-primary" />
        Add New Task
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Subject Name */}
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

        {/* Difficulty Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Difficulty</Label>
            <span className="text-sm text-primary font-medium">
              {difficulty} - {getDifficultyLabel(difficulty)}
            </span>
          </div>
          <Slider
            value={[difficulty]}
            onValueChange={(value) => setDifficulty(value[0])}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>

        {/* Priority Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Priority</Label>
            <span className="text-sm text-primary font-medium">
              {priority} - {getPriorityLabel(priority)}
            </span>
          </div>
          <Slider
            value={[priority]}
            onValueChange={(value) => setPriority(value[0])}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Critical</span>
          </div>
        </div>

        {/* Deadline with Popover Calendar */}
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
                onSelect={(date) => {
                  setDeadline(date);
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

        {/* Submit Button */}
        <Button type="submit" className="w-full btn-primary" disabled={!subject.trim() || !deadline}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </form>
    </motion.div>
  );
};

export default TaskInputForm;
