
import { motion } from "framer-motion";
import "./Footer.css";

const logs = [
  "[BOOT] Loading connections...",
  "[OK] Social channels linked",
  "[OK] Project navigation ready",
  "[OK] Support resources available",
  "[READY] All systems operational"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Footer({ onNavigate }) {
  function handleNavigate(e, href) {
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    onNavigate?.(href);
  }

  return (
    <footer id="contact" className="terminal-footer">

      {/* Background Effects */}

      <div className="terminal-grid" />
      <div className="terminal-scanline" />
      <div className="terminal-noise" />
      <div className="terminal-glow" />

      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >

        {/* Header */}

        <motion.div
          className="terminal-header"
          variants={itemVariants}
        >

          <div className="terminal-title">
            <span className="prompt">&gt;_</span>

            <h2>
               <span>codeutil</span>
            </h2>

            <span className="cursor"></span>
          </div>

          <p>
            Everything loaded successfully.
            Your project is ready for the next viva.
          </p>

        </motion.div>

        {/* Boot logs removed */}

        {/* Commands */}

        <motion.div
          className="terminal-sections"
          variants={itemVariants}
        >

          <div className="terminal-block">

            <div className="block-title">
              &gt;_connect
            </div>

            <a href="https://www.linkedin.com/company/arthirmus/?viewAsMember=true&utm_source=chatgpt.com" target="_blank" rel="noreferrer">
              &gt; LinkedIn
            </a>

            <a href="https://www.instagram.com/arthirmus?igsh=MWhkYWkzazk4aG94Mw==" target="_blank" rel="noreferrer">
              &gt; Instagram
            </a>

            <a href="https://x.com/Arthirmus" target="_blank" rel="noreferrer">
              &gt; X (Twitter)
            </a>

            <a href="mailto:arthirmus@gmail.com">
              &gt; arthirmus@gmail.com
            </a>

            <div style={{
              marginTop: "0.75rem",
              padding: "0.6rem 0.75rem",
              border: "1px solid rgba(0, 255, 170, 0.35)",
              borderRadius: "6px",
              background: "rgba(0, 255, 170, 0.08)",
              color: "#8fffd2",
              fontSize: "0.9rem",
              lineHeight: 1.4
            }}>
              For troubleshooting and feedback, contact us at <a href="mailto:arthirmus@gmail.com" style={{ color: "#ffffff", textDecoration: "underline" }}>arthirmus@gmail.com</a>
            </div>

          </div>

          <div className="terminal-block">

            <div className="block-title">
             &gt;_ project
            </div>

            <a href="#top" onClick={(e) => handleNavigate(e, '#top')}>
              &gt; Home
            </a>

            <a href="#how-it-works" onClick={(e) => handleNavigate(e, '#how-it-works')}>
              &gt; How it Works
            </a>

            <a href="#contact" onClick={(e) => handleNavigate(e, '#contact')}>
              &gt; Upload Project
            </a>

            <a href="#capabilities" onClick={(e) => handleNavigate(e, '#capabilities')}>
              &gt; Documentation
            </a>

          </div>

          <div className="terminal-block">

            <div className="block-title">
             &gt;_support
            </div>

            <a href="#contact" onClick={(e) => handleNavigate(e, '#contact')}>
              &gt; Contact
            </a>

            <a href="#top" onClick={(e) => handleNavigate(e, '#top')}>
              &gt; Privacy
            </a>

            <a href="#top" onClick={(e) => handleNavigate(e, '#top')}>
              &gt; Terms
            </a>

            <a href="#faq" onClick={(e) => handleNavigate(e, '#faq')}>
              &gt; FAQ
            </a>

          </div>

        </motion.div>

        {/* Bottom */}

        <motion.div
          className="terminal-bottom"
          variants={itemVariants}
        >

          <div>
            <span className="green">STATUS</span>

            <span>
              ONLINE
            </span>

            <span className="cursor small"></span>
          </div>

          <div>
            © 2026 CODEUTIL
          </div>

          <div>
            FOR GEN Z • BY GEN Z
          </div>

        </motion.div>

      </motion.div>

    </footer>
  );
}

