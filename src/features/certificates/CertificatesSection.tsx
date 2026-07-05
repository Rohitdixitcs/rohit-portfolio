import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiExternalLink, FiAward, FiChevronDown } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CERTIFICATES } from "@/data/certificates";
import type { Certificate } from "@/types";

const ISSUER_COLORS: Record<string, string> = {
  "Meta (Coursera)": "#0081FB",
  "Google (Coursera)": "#4285F4",
  "freeCodeCamp": "#0A0A23",
  "DeepLearning.AI (Coursera)": "#EF4444",
  "MongoDB University": "#00ED64",
};

function CertCard({ cert, index }: { cert: Certificate; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = ISSUER_COLORS[cert.issuer] ?? "#6366f1";

  return (
    <motion.article
      className="group rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.06] overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      whileHover={{ borderColor: `${color}30` }}
      onClick={() => setExpanded(!expanded)}
      aria-expanded={expanded}
    >
      {/* Gradient top strip */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${color}60 0%, ${color}20 100%)` }}
        aria-hidden="true"
      />

      <div className="p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 border"
              style={{ background: `${color}15`, borderColor: `${color}25` }}
            >
              <FiAward className="w-5 h-5" style={{ color }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-foreground leading-snug mb-1.5" style={{ fontSize: "var(--fs-card-title)" }}>
                {cert.title}
              </h3>
              <p className="text-muted-foreground flex items-center gap-2" style={{ fontSize: "var(--fs-badge)" }}>
                <span>{cert.issuer}</span>
                <span className="text-border" aria-hidden="true">·</span>
                <span>{cert.issuedAt}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {cert.credentialUrl && cert.credentialUrl !== "#" && (
              <motion.a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground bg-white/[0.04] border border-white/[0.06] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View credential for ${cert.title}`}
              >
                <FiExternalLink className="w-3.5 h-3.5" />
              </motion.a>
            )}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground"
            >
              <FiChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/[0.05] mt-4">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-mono mb-3">
                  Skills Covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg font-mono text-xs border"
                      style={{
                        color: color,
                        background: `${color}10`,
                        borderColor: `${color}20`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export function CertificatesSection() {
  return (
    <SectionWrapper id="certificates" label="Certificates">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[150px] pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="Certificates"
        title="Learning Never Stops"
        description="Verified credentials from Meta, Google, freeCodeCamp, and DeepLearning.AI — expanding the stack continuously."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATES.map((cert, i) => (
          <CertCard key={cert.id} cert={cert} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
