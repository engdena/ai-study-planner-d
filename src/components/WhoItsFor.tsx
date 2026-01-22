import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, BookOpen, Users } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "University Students",
    description:
      "Whether you're a freshman or senior, managing multiple courses with overlapping deadlines becomes effortless.",
  },
  {
    icon: BookOpen,
    title: "Self-Learners",
    description:
      "Pursuing certifications, online courses, or professional development? Structure your independent study effectively.",
  },
  {
    icon: Users,
    title: "Study Groups",
    description:
      "Coordinate group projects and study sessions with shared schedules that keep everyone aligned.",
  },
];

const WhoItsFor = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
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
            Who It's For
          </span>
          <h2 className="section-title mb-4">
            Built for ambitious learners
          </h2>
          <p className="section-subtitle mx-auto">
            Whether you're in a lecture hall or learning from home, we've got you covered.
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
            >
              <div className="card-elevated p-8 text-center h-full hover:shadow-glow transition-shadow duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <audience.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
