import { motion } from "motion/react";
import { FiArrowUpRight, FiCircle } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LAB_ITEMS, LAB_STATUS_CONFIG } from "@/data/futureLab";
import type { LabItem } from "@/types";

function LabCard({ item, index }: { item: LabItem; index: number }) {
  const status = LAB_STATUS_CONFIG[item.status];
  const isBuilding = item.status === "building";

  return (
    <motion.div
      className="group relative rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.06] p-6 overflow-hidden"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      whileHover={{
        borderColor: `${item.accentColor}30`,
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 24 },
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ background: item.accentColor }}
        aria-hidden="true"
      />

      {/* Gradient strip */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)` }}
        aria-hidden="true"
      />

      {/* Status */}
      <div className="flex items-center justify-between mb-5">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border"
          style={{
            color: status.color,
            background: `${status.color}12`,
            borderColor: `${status.color}25`,
          }}
        >
          {isBuilding ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: status.color }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: status.color }} />
            </span>
          ) : (
            <FiCircle className="w-2 h-2" />
          )}
          {status.label}
        </span>

        <motion.div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground bg-white/[0.04] border border-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          aria-hidden="true"
        >
          <FiArrowUpRight className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      {/* Icon block */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border font-display font-bold text-sm"
        style={{
          background: `${item.accentColor}12`,
          borderColor: `${item.accentColor}20`,
          color: item.accentColor,
        }}
      >
        {item.title.charAt(0)}
      </div>

      <h3 className="font-display font-semibold text-base text-foreground mb-2">{item.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-lg font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/[0.05]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function FutureLabSection() {
  return (
    <SectionWrapper id="future-lab" label="Future Lab">
      {/* Background — starfield feel */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(99,102,241,0.4) 60%, transparent 100%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="Future Lab"
        title="Ideas in Motion"
        description="The things I'm building, experimenting with, or just dreaming up. Everything starts as a concept."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LAB_ITEMS.map((item, i) => (
          <LabCard key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Bottom tagline */}
      <motion.p
        className="mt-12 text-center font-mono text-xs text-muted-foreground/50 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        // more coming soon — follow{" "}
        <a
          href="https://github.com/Rohitdixitcs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/60 hover:text-primary transition-colors"
        >
          @Rohitdixitcs
        </a>
      </motion.p>
    </SectionWrapper>
  );
}
