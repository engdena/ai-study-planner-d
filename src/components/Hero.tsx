import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-wide section-padding py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-primary/10 rounded-full border border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered Study Planning</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6">
              Study smarter,{" "}
              <span className="text-gradient">not harder</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              An intelligent study planner that adapts to your schedule, courses, and learning style. 
              Get your own private copy—your data stays yours, always.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://docs.google.com/spreadsheets/d/1koW4a1BgcIWwt_eoqJxw35FA9rzt0hP8jCmTDZrGccg/copy"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group"
              >
                Get Your Private Planner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#how-it-works" className="btn-secondary">
                See How It Works
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left">
              Clicking this will create your own private copy to use.
            </p>

            {/* Trust indicators */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Trusted by students from</p>
              <div className="flex items-center gap-4 justify-center lg:justify-start text-muted-foreground/50 flex-wrap">
                <span className="text-xs font-medium">King Saud University</span>
                <span className="text-xs font-medium">King Abdulaziz University</span>
                <span className="text-xs font-medium">King Khalid University</span>
                <span className="text-xs font-medium">KFUPM</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated card-glow">
              <img
                src={heroIllustration}
                alt="AI Study Planner Dashboard showing an organized calendar with study sessions"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -left-4 bottom-8 bg-card border border-border rounded-xl p-4 shadow-elevated hidden sm:block"
            >
              <p className="text-2xl font-semibold text-foreground">2.5x</p>
              <p className="text-xs text-muted-foreground">More productive</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
