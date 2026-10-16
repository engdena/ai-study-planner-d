import { motion } from "framer-motion";
import { Settings, Clock, Calendar, Timer, Hourglass } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
      <h3 className="text-sm font-semibold text-foreground mb-5 tracking-tight flex items-center gap-2">
        <Settings className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        Study Settings
      </h3>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Total Weekly Hours
            </Label>
            <span className="text-xs text-foreground font-semibold tabular-nums">
              {settings.totalWeeklyHours} hrs
            </span>
          </div>
          <Slider
            value={[settings.totalWeeklyHours]}
            onValueChange={(v) => onUpdateSettings({ totalWeeklyHours: v[0] })}
            min={5}
            max={40}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 hrs</span>
            <span>40 hrs</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Study Days Per Week
            </Label>
            <span className="text-xs text-foreground font-semibold tabular-nums">
              {settings.studyDaysPerWeek} days
            </span>
          </div>
          <Slider
            value={[settings.studyDaysPerWeek]}
            onValueChange={(v) => onUpdateSettings({ studyDaysPerWeek: v[0] })}
            min={1}
            max={7}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 day</span>
            <span>7 days</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-muted-foreground" />
              Daily Available Hours
            </Label>
            <span className="text-xs text-foreground font-semibold tabular-nums">
              {settings.dailyAvailableHours} hrs
            </span>
          </div>
          <Slider
            value={[settings.dailyAvailableHours]}
            onValueChange={(v) => onUpdateSettings({ dailyAvailableHours: v[0] })}
            min={1}
            max={12}
            step={0.5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Capacity check</span>
            <span>12 hrs</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            Daily Start Time
          </Label>
          <Input
            type="time"
            value={settings.startTime}
            onChange={(e) => onUpdateSettings({ startTime: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Avg daily study time:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {(settings.totalWeeklyHours / settings.studyDaysPerWeek).toFixed(1)} hrs/day
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlannerSettings;
