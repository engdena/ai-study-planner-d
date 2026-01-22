import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const GoogleSheetEmbed = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sheetId = "1koW4a1BgcIWwt_eoqJxw35FA9rzt0hP8jCmTDZrGccg";
  const copyUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/copy`;
  const previewUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview`;

  return (
    <section id="planner" className="py-24 lg:py-32">
      <div className="container-wide section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
          ref={ref}
        >
          <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary mb-4">
            Interactive Planner
          </span>
          <h2 className="section-title mb-4">
            Preview the planner
          </h2>
          <p className="section-subtitle mx-auto mb-6">
            Take a look at how the AI Study Planner works. When you're ready, 
            get your own private copy to customize and use.
          </p>

          <div className="flex flex-col items-center">
            <a
              href={copyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Get Your Private Copy
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Clicking this will create your own copy to use privately.
            </p>
          </div>
        </motion.div>

        {/* Embed Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-elevated overflow-hidden"
        >
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <iframe
              src={previewUrl}
              className="absolute inset-0 w-full h-full border-0"
              title="AI Study Planner - Interactive Google Sheet Preview"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Your data stays private—only you can see and edit your personal copy.
        </motion.p>
      </div>
    </section>
  );
};

export default GoogleSheetEmbed;
