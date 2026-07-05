import { useState } from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser";
import { FiSend, FiMail, FiGithub, FiLinkedin, FiMapPin, FiUser, FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PERSONAL_INFO } from "@/data/personal";
import { ENV, isEmailJsConfigured } from "@/lib/env";
import { trackEvent, recordInteraction } from "@/lib/analytics";

// ─── Contact form ──────────────────────────────────────────────────────────

interface FormState { name: string; email: string; subject: string; message: string; }

function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errors.name = "Please enter your name.";
    if (!form.email.trim()) errors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Please enter a valid email address.";
    if (!form.message.trim()) errors.message = "Please enter a message.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setSending(true);

    try {
      if (isEmailJsConfigured()) {
        await emailjs.send(
          ENV.EMAILJS_SERVICE_ID!,
          ENV.EMAILJS_TEMPLATE_ID!,
          {
            from_name: form.name,
            reply_to: form.email,
            subject: form.subject || "New portfolio message",
            message: form.message,
            to_name: PERSONAL_INFO.firstName,
          },
          { publicKey: ENV.EMAILJS_PUBLIC_KEY! }
        );
      } else {
        // EmailJS isn't configured yet — fall back to the visitor's own mail
        // client so the message still reaches you, rather than silently failing.
        const mailBody = encodeURIComponent(
          `From: ${form.name} <${form.email}>\n\n${form.message}`
        );
        window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
          form.subject || "Portfolio contact"
        )}&body=${mailBody}`;
      }
      trackEvent("contact_submit");
      recordInteraction("contact");
      setSent(true);
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setError("Something went wrong sending that. Please email me directly instead.");
    } finally {
      setSending(false);
    }
  };

  const inputBase = "w-full bg-white/[0.04] border rounded-2xl px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none";
  const inputFocused = (id: string) =>
    focused === id
      ? "border-primary/50 shadow-[0_0_0_3px_rgba(129,140,248,0.1)] bg-white/[0.06]"
      : "border-white/[0.07] hover:border-white/[0.12]";

  if (sent) {
    return (
      <motion.div
        className="h-full flex flex-col items-center justify-center text-center py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-5">
          <FiSend className="w-6 h-6 text-success" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground text-sm">
          Thanks for reaching out — I'll get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {!isEmailJsConfigured() && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>EmailJS isn't configured yet — submitting will open your email client instead. See README to enable direct sending.</span>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              required
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
              onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setFieldErrors((f) => ({ ...f, name: undefined })); }}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              className={`${inputBase} ${inputFocused("name")} pl-10`}
              aria-label="Name"
            />
          </div>
          {fieldErrors.name && <p id="contact-name-error" className="text-xs text-destructive mt-1.5">{fieldErrors.name}</p>}
        </div>

        <div>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" aria-hidden="true" />
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
              onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setFieldErrors((f) => ({ ...f, email: undefined })); }}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={`${inputBase} ${inputFocused("email")} pl-10`}
              aria-label="Email"
            />
          </div>
          {fieldErrors.email && <p id="contact-email-error" className="text-xs text-destructive mt-1.5">{fieldErrors.email}</p>}
        </div>
      </div>

      <input
        type="text"
        placeholder="Subject — what's this about?"
        value={form.subject}
        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        onFocus={() => setFocused("subject")}
        onBlur={() => setFocused(null)}
        className={`${inputBase} ${inputFocused("subject")}`}
        aria-label="Subject"
      />

      <div>
      <div className="relative">
        <FiMessageSquare className="absolute left-4 top-4 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" aria-hidden="true" />
        <textarea
          placeholder="Tell me about your project, opportunity, or just say hi..."
          value={form.message}
          required
          rows={5}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          onChange={(e) => { setForm((f) => ({ ...f, message: e.target.value })); setFieldErrors((f) => ({ ...f, message: undefined })); }}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          className={`${inputBase} ${inputFocused("message")} pl-10 resize-none`}
          aria-label="Message"
        />
      </div>
      {fieldErrors.message && <p id="contact-message-error" className="text-xs text-destructive mt-1.5">{fieldErrors.message}</p>}
      </div>

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={sending}
        className="w-full h-12 rounded-xl font-display font-medium text-sm text-primary-foreground bg-primary flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
        whileHover={{ scale: 1.01, boxShadow: "0 8px_30px rgba(129,140,248,0.35)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        {sending ? (
          <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <FiSend className="w-3.5 h-3.5" />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}

// ─── Contact info item ─────────────────────────────────────────────────────

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
        <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-mono">{label}</p>
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        data-cursor={href.startsWith("mailto:") ? "EMAIL" : "OPEN"}
        className="block"
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

// ─── Section ───────────────────────────────────────────────────────────────

export function ContactSection() {
  return (
    <SectionWrapper id="contact" label="Contact">
      {/* Ambient */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="Contact"
        title="Let's Build Something Great"
        description="Open to internships, freelance projects, and collaboration. If you have an idea worth building, let's talk."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left — info */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3 leading-tight">
              Ready to work together?<br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--primary), #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Drop me a message.
              </span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Whether you're a startup looking for a developer, a recruiter with an internship, or a fellow builder — I'm all ears.
            </p>
          </div>

          <div className="space-y-4">
            <ContactItem icon={FiMail} label="Email" value={PERSONAL_INFO.email} href={`mailto:${PERSONAL_INFO.email}`} />
            <ContactItem icon={FiLinkedin} label="LinkedIn" value="in/rohit-dixit-224013366" href={PERSONAL_INFO.social.find((s) => s.id === "linkedin")?.url} />
            <ContactItem icon={FiGithub} label="GitHub" value="@Rohitdixitcs" href={PERSONAL_INFO.social.find((s) => s.id === "github")?.url} />
            <ContactItem icon={FiMapPin} label="Location" value={PERSONAL_INFO.location} />
          </div>

          {/* Response time badge */}
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-success/5 border border-success/15 self-start">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-sm text-success/90 font-display">Usually responds within 24 hours</span>
          </div>
        </div>

        {/* Right — form */}
        <div className="rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.07] p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
}
