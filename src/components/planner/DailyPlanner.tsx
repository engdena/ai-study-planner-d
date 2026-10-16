import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addDays, format, isToday } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Pencil, Plus, Trash2, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDurationFromMinutes } from "@/types/studyPlanner";
import { BlockPriority, DailyBlock, dateKey, minutesToTime, timeToMinutes } from "@/lib/dailyPlan";
import { cn } from "@/lib/utils";

interface DailyPlannerProps {
  getBlocksForDate: (d: Date) => DailyBlock[];
  addBlock: (b: Omit<DailyBlock, "id" | "color" | "done">) => void;
  updateBlock: (id: string, u: Partial<DailyBlock>) => void;
  deleteBlock: (id: string) => void;
  subjects: string[];
}

const priorityStyles: Record<BlockPriority, string> = {
  High: "bg-foreground text-background border-foreground",
  Medium: "bg-secondary text-foreground border-border",
  Low: "bg-transparent text-muted-foreground border-border",
};

const emptyForm = { subject: "", activity: "", start: "09:00", duration: 60, priority: "Medium" as BlockPriority };

const DailyPlanner = ({ getBlocksForDate, addBlock, updateBlock, deleteBlock, subjects }: DailyPlannerProps) => {
  const [date, setDate] = useState(() => new Date());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DailyBlock | null>(null);
  const [form, setForm] = useState(emptyForm);

  const blocks = getBlocksForDate(date);
  const { doneMin, totalMin } = useMemo(
    () => ({
      totalMin: blocks.reduce((s, b) => s + b.duration, 0),
      doneMin: blocks.filter((b) => b.done).reduce((s, b) => s + b.duration, 0),
    }),
    [blocks]
  );
  const pct = totalMin ? Math.round((doneMin / totalMin) * 100) : 0;

  useEffect(() => {
    if (!modalOpen) return;
    if (editing) {
      setForm({ subject: editing.subject, activity: editing.activity, start: editing.start, duration: editing.duration, priority: editing.priority });
    } else {
      const last = blocks[blocks.length - 1];
      const start = last ? minutesToTime(timeToMinutes(last.start) + last.duration + 30) : "09:00";
      setForm({ ...emptyForm, start, subject: subjects[0] ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, editing]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (b: DailyBlock) => { setEditing(b); setModalOpen(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || form.duration <= 0) return;
    const payload = { ...form, subject: form.subject.trim(), activity: form.activity.trim() || "Focused study session" };
    if (editing) updateBlock(editing.id, payload);
    else addBlock({ ...payload, date: dateKey(date) });
    setModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-6 space-y-6">
      {/* Day selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Previous day" onClick={() => setDate((d) => addDays(d, -1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[210px] justify-start font-medium">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(date, "EEEE, MMM d, yyyy", { locale: enUS })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={enUS}
                selected={date}
                onSelect={(d) => { if (d) setDate(d); setPickerOpen(false); }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" aria-label="Next day" onClick={() => setDate((d) => addDays(d, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          {!isToday(date) && (
            <Button variant="ghost" size="sm" onClick={() => setDate(new Date())}>
              <Sun className="w-4 h-4 mr-1" /> Today
            </Button>
          )}
        </div>
        <Button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      {/* Completion bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-foreground">Daily Completion</span>
          <span className="text-muted-foreground">
            {formatDurationFromMinutes(doneMin)} of {formatDurationFromMinutes(totalMin)} · {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Time blocks */}
      {blocks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No study blocks for this day</p>
          <p className="text-xs mt-1">Add subjects in the planner or create a block manually.</p>
        </div>
      ) : (
        <ol className="relative space-y-3 border-l border-border ml-2 pl-6">
          <AnimatePresence initial={false}>
            {blocks.map((b) => {
              const end = minutesToTime(timeToMinutes(b.start) + b.duration);
              return (
                <motion.li
                  key={b.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className={cn(
                    "relative group rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-foreground/20",
                    b.done && "opacity-60"
                  )}
                >
                  <span className="absolute -left-[31px] top-5 w-3 h-3 rounded-full ring-4 ring-background" style={{ backgroundColor: b.color }} />
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={b.done}
                      onCheckedChange={(v) => updateBlock(b.id, { done: v === true })}
                      aria-label={`Mark ${b.subject} done`}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground tabular-nums">{b.start} – {end}</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border border-border">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                          {b.subject}
                        </span>
                        <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border", priorityStyles[b.priority])}>
                          {b.priority}
                        </span>
                      </div>
                      <p className={cn("text-sm text-foreground", b.done && "line-through")}>{b.activity}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDurationFromMinutes(b.duration)}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" aria-label="Edit block" onClick={() => openEdit(b)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete block" onClick={() => deleteBlock(b.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Time Block" : `Add Block · ${format(date, "MMM d", { locale: enUS })}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blk-subject">Subject / Course</Label>
              <Input id="blk-subject" list="blk-subjects" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              <datalist id="blk-subjects">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blk-activity">Activity / Goal</Label>
              <Input id="blk-activity" placeholder="e.g., Solve chapter 4 exercises" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="blk-start">Start</Label>
                <Input id="blk-start" type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blk-dur">Minutes</Label>
                <Input id="blk-dur" type="number" min={5} step={5} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as BlockPriority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save Changes" : "Add Block"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DailyPlanner;
