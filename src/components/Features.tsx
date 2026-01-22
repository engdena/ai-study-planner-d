import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Brain, 
  Clock, 
  Target, 
  BarChart3, 
  RefreshCw 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Scheduling",
    description:
      "Intelligent algorithms that understand academic workloads and optimize your study sessions for maximum retention.",
  },
  {
    icon: Clock,
    title: "Time-Block Planning",
    description:
      "Automatically creates focused study blocks with built-in breaks to prevent burnout and maintain concentration.",
  },
  {
    icon: Target,
    title: "Priority Scoring",
    description:
      "Ranks tasks by urgency and importance so you always know exactly what to work on next.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Visual dashboards show your study progress, completed topics, and areas needing more attention.",
  },
  {
    icon: RefreshCw,
    title: "Dynamic Adjustments",
    description:
      "Plans automatically adapt when deadlines change or new assignments come up. Stay flexible without the chaos.",
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 lg:py-32">
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
            Features
          </span>
          <h2 className="section-title mb-4">
            Everything you need to excel academically
          </h2>
          <p className="section-subtitle mx-auto">
            Built specifically for the unique challenges of university life.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group"
            >
              <div className="card-elevated p-6 h-full hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>

                <h3 className="text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
