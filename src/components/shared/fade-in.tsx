"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  delay?: number;
  y?: number;
  duration?: number;
}

export function FadeIn({ delay = 0, y = 16, duration = 0.35, children, ...rest }: FadeInProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface FadeInListProps {
  children: React.ReactNode[];
  stagger?: number;
  className?: string;
  as?: "div" | "ul" | "section";
}

export function FadeInList({ children, stagger = 0.05, className, as: As = "div" }: FadeInListProps) {
  const reduced = useReducedMotion();
  return (
    <As className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * stagger, duration: 0.3, ease: "easeOut" }}
          className="contents"
        >
          {child}
        </motion.div>
      ))}
    </As>
  );
}
