import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Task } from "@/types/studyPlanner";

interface TaskInputFormProps {
  onAddTask: (task: Omit<Task, "id">) => void;
}

const TaskInputForm = ({ onAddTask }: TaskInputFormProps) => {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [priority, setPriority] = useState(3);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !deadline) return;

    onAddTask({
      subject: subject.trim(),
      difficulty,
      priority,
      deadline: new Date(deadline),
    });

    // Reset form
    setSubject("");
    setDifficulty(3);
    setPriority(3);
    setDeadline("");
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
  const today = new Date().toISOString().split("T")[0];

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

        {/* Deadline */}
        <div className="space-y-2">
          <Label htmlFor="deadline" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Deadline
          </Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={today}
            className="w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full btn-primary">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </form>
    </motion.div>
  );
};

export default TaskInputForm;
