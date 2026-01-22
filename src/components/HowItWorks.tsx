import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, Cpu, CalendarCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Input Your Courses",
    description:
      "Add your subjects, exam dates, assignments, and how much time you have available each week. Takes less than 5 minutes.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Creates Your Plan",
    description:
      "Our algorithm analyzes difficulty levels, time requirements, and your learning patterns to generate an optimal study schedule.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Follow & Succeed",
    description:
      "Execute your personalized daily plan. Track progress, adjust as needed, and watch your academic performance soar.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container-wide section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
          ref={ref}
        >
          <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary mb-4">
            How It Works
          </span>
          <h2 className="section-title mb-4">
            Three simple steps to academic clarity
          </h2>
          <p className="section-subtitle mx-auto">
            Getting started takes minutes. The benefits last the entire semester.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
              )}

              <div className="card-elevated p-8 relative bg-card hover:shadow-glow transition-shadow duration-300">
                {/* Number badge */}
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  {step.number}
                </span>

                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
