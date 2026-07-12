
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

            <a href="https://www.linkedin.com/company/arthirmus/?viewAsMember=true&utm_source=chatgpt.com" target="_blank" rel="noreferrer">
              &gt; Instagram
            </a>

            <a href="https://www.linkedin.com/company/arthirmus/?viewAsMember=true&utm_source=chatgpt.com" target="_blank" rel="noreferrer">
              &gt; X (Twitter)
            </a>

            <a href="mailto:support@codeutil.ai">
              &gt; support@codeutil.ai
            </a>

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

