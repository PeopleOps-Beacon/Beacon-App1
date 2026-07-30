import { motion } from "framer-motion";
import { beaconMarkUrl } from "../brand/brandAssets";

export function BeaconLogo() {
  return (
    <div className="logo-lockup" aria-label="Beacon OS">
      <motion.div
        className="logo-mark brand-logo-mark"
        initial={{ scale: 0.94, opacity: 0.72 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.72, ease: "easeOut" }}
      >
        <img alt="Beacon lighthouse mark" decoding="async" src={beaconMarkUrl} />
      </motion.div>
      <div>
        <span>Beacon</span>
        <strong>OS 3.0</strong>
        <small>Airport intelligence workspace</small>
      </div>
    </div>
  );
}
