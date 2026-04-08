"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0,
  direction = "up"
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [disableMotion, setDisableMotion] = useState(false);

  useEffect(() => {
    const updateMotionPreference = () => {
      setDisableMotion(window.innerWidth < 768);
    };

    updateMotionPreference();
    window.addEventListener("resize", updateMotionPreference);

    return () => window.removeEventListener("resize", updateMotionPreference);
  }, []);
  
  const getInitialY = () => {
    if (direction === "up") return 40;
    if (direction === "down") return -40;
    return 0;
  }

  const getInitialX = () => {
    if (direction === "left") return 40;
    if (direction === "right") return -40;
    return 0;
  }

  if (prefersReducedMotion || disableMotion || direction === "none") {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: getInitialY(),
        x: getInitialX()
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        x: 0
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.55, 
        ease: [0.16, 1, 0.3, 1],
        delay 
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
