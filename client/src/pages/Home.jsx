import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ease: "easeInOut", duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.2 },
      scale: 0.7,
    },
  };

  return (
    <>
      <motion.div
        key="poggers"
        style={{ width: "100%", height: "100%" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Link to="/profile">Profile</Link>
        <div>HOME</div>
      </motion.div>
    </>
  );
}

export default Home;
