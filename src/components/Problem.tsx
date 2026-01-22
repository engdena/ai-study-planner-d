import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import problemIllustration from "@/assets/problem-illustration.png";

const Problem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    "Constantly overwhelmed by multiple deadlines",
    "No clear system for prioritizing what to study",
    "Spending more time planning than actually learning",
    "Last-minute cramming before every exam",
  ];

  return (
    <section id="problem" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container-wide section-padding">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative max-w-md mx-auto lg:mx-0">
              <img
                src={problemIllustration}
                alt="Stressed student surrounded by scattered papers and books"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary mb-4">
              The Problem
            </span>
            <h2 className="section-title mb-6">
              Academic chaos is draining your potential
            </h2>
            <p className="section-subtitle mb-8">
              University life is demanding. Between lectures, assignments, exams, and life—
              most students feel constantly behind. Traditional planners don't understand 
              the complexity of academic scheduling.
            </p>

            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  </span>
                  <span className="text-muted-foreground">{problem}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
