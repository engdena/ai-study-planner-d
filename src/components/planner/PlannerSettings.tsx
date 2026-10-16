import { motion } from "framer-motion";
import { Settings, Clock, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlannerSettings as PlannerSettingsType } from "@/types/studyPlanner";

interface PlannerSettingsProps {
  settings: PlannerSettingsType;
  onUpdateSettings: (settings: Partial<PlannerSettingsType>) => void;
}

const PlannerSettings = ({ settings, onUpdateSettings }: PlannerSettingsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="card-elevated p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        Study Settings
      </h3>

      <div className="space-y-6">
        {/* Total Weekly Hours */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Total Weekly Study Hours
            </Label>
            <span className="text-sm text-primary font-semibold">
              {settings.totalWeeklyHours} hrs
            </span>
          </div>
          <Slider
            value={[settings.totalWeeklyHours]}
            onValueChange={(value) => onUpdateSettings({ totalWeeklyHours: value[0] })}
            min={5}
            max={40}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 hrs</span>
            <span>40 hrs</span>
          </div>
        </div>

        {/* Study Days Per Week */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Study Days Per Week
            </Label>
            <span className="text-sm text-primary font-semibold">
              {settings.studyDaysPerWeek} days
            </span>
          </div>
          <Slider
            value={[settings.studyDaysPerWeek]}
            onValueChange={(value) => onUpdateSettings({ studyDaysPerWeek: value[0] })}
            min={1}
            max={7}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 day</span>
            <span>7 days</span>
          </div>
        </div>

        {/* Daily average calculation */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Average daily study time:</span>
            <span className="font-semibold text-foreground">
              {(settings.totalWeeklyHours / settings.studyDaysPerWeek).toFixed(1)} hrs/day
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlannerSettings;
