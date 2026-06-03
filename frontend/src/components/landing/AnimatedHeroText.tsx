import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedHeroText() {
  const words = ["events", "proposals", "partnerships", "organizers", "companies"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-grid grid-cols-1 grid-rows-1 text-center align-baseline">
      <AnimatePresence>
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="col-start-1 row-start-1 whitespace-nowrap bg-gradient-to-r from-primary-blue to-accent-blue bg-clip-text text-transparent font-bold pb-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
