import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import solutionIllustration from "@/assets/solution-illustration.png";

const Solution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    "Clear daily study plans tailored to your courses",
    "Smart prioritization based on exam dates and difficulty",
    "Realistic time blocks that prevent burnout",
    "Progress tracking to keep you motivated",
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container-wide section-padding">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary mb-4">
              The Solution
            </span>
            <h2 className="section-title mb-6">
              Your AI study assistant that actually works
            </h2>
            <p className="section-subtitle mb-8">
              Our AI-powered planner analyzes your courses, deadlines, and available time 
              to create personalized study schedules. Each user gets their own private copy—
              your data is never shared with anyone else.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <img
                src={solutionIllustration}
                alt="Happy student with organized calendar and completed tasks"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
