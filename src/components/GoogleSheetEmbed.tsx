import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const GoogleSheetEmbed = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sheetUrl = "https://docs.google.com/spreadsheets/d/1koW4a1BgcIWwt_eoqJxw35FA9rzt0hP8jCmTDZrGccg/edit?usp=sharing";
  const embedUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqoZQ_gNJhNKjX7_qS3eXX9rVw5oRXvMvAjJ7Qf5VwL7pZUqR8VmBKqwJnU7rT5D8hPmGlQKb1n6Wz/pubhtml?widget=true&amp;headers=false";

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
            Try the planner right now
          </h2>
          <p className="section-subtitle mx-auto mb-8">
            Explore the AI Study Planner below. For the full experience with editing capabilities, 
            open it in Google Sheets.
          </p>

          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            Open Planner in Google Sheets
            <ExternalLink className="w-4 h-4" />
          </a>
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
              src={sheetUrl.replace('/edit?usp=sharing', '/preview')}
              className="absolute inset-0 w-full h-full border-0"
              title="AI Study Planner - Interactive Google Sheet"
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
          Make a copy to your own Google Drive and start customizing your study plan.
        </motion.p>
      </div>
    </section>
  );
};

export default GoogleSheetEmbed;
