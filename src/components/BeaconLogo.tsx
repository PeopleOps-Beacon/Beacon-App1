import { motion } from "framer-motion";
import { RadioTower } from "lucide-react";

export function BeaconLogo() {
  return (
    <div className="logo-lockup" aria-label="Beacon OS">
      <motion.div
        className="logo-mark"
        initial={{ scale: 0.92, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <RadioTower aria-hidden="true" />
      </motion.div>
      <div>
        <span>Beacon</span>
        <strong>OS 3.0</strong>
      </div>
    </div>
  );
}
