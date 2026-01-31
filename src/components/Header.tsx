import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container-wide section-padding">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">StudyPlanner</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Why
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
          </nav>

          <a
            href="https://docs.google.com/spreadsheets/d/1D2WSKU5QDCAKI99QoirYpZFrxl-ikRhwX1cUhXZahyk/copy"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2"
          >
            Get Your Copy
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
