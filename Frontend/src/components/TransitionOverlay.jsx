import { AnimatePresence, motion } from 'framer-motion';

export default function TransitionOverlay({ title, message }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="transition-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="transition-shell__panel"
          initial={{ scale: 0.96, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 1.04, y: -10, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="transition-shell__logo">&gt;_</div>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="transition-shell__bar">
            <span />
          </div>
          <div className="transition-shell__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
