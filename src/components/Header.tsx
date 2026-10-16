import { motion } from "framer-motion";
import { BookOpen, ArrowDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const scrollToTasks = () => {
    window.dispatchEvent(new CustomEvent("planner:open-tasks"));
    setTimeout(() => {
      document
        .getElementById("planner")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
    >
      <div className="container-wide section-padding">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-background" strokeWidth={1.75} />
            </div>
            <span className="font-semibold text-foreground tracking-tight">
              StudyPlanner
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#planner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={scrollToTasks} className="btn-primary text-sm py-2 group">
              Add a Task
              <ArrowDown
                className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
