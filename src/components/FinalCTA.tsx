import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const FinalCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 lg:py-32 bg-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-narrow section-padding relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-background/10 rounded-full border border-background/20"
          >
            <Sparkles className="w-4 h-4 text-background" />
            <span className="text-sm font-medium text-background">100% Free to Use</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-background leading-tight mb-6">
            Stop stressing about your schedule.
            <br />
            <span className="opacity-80">Start studying smarter today.</span>
          </h2>

          <p className="text-lg text-background/70 max-w-xl mx-auto mb-10">
            Join thousands of students who have transformed their academic performance 
            with intelligent study planning. Get your own private planner—completely free.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <a
              href="https://docs.google.com/spreadsheets/d/1D2WSKU5QDCAKI99QoirYpZFrxl-ikRhwX1cUhXZahyk/copy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl transition-all duration-200 bg-background text-foreground hover:bg-background/90 active:scale-[0.98] shadow-elevated group"
            >
              Get Your Private Planner — Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-xs text-background/50 mt-3">
              Clicking this will create your own copy to use privately.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
