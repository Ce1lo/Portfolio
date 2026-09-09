"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

const EASE = [0.16, 1, 0.3, 1] as const;

export type RevealProps = {
  children: ReactNode;
  /** Direction the element travels from. Default `up`. */
  from?: Direction;
  /** Stagger delay in seconds. Default 0. */
  delay?: number;
  duration?: number;
  /** How much of the element must be visible before it animates. 0 to 1. */
  amount?: number;
  className?: string;
  /** Render as a different element, e.g. "li" inside a list. */
  as?: "div" | "li" | "section" | "article" | "figure" | "span";
};

/**
 * Scroll-triggered entrance.
 *
 * `viewport.once` keeps the animation from replaying on every scroll back up,
 * which is the difference between motion that feels intentional and motion that
 * feels like a slot machine.
 *
 * Reduced motion degrades to a static render: `initial={false}` skips the
 * hidden state entirely, so nothing is ever invisible for a user who has asked
 * the OS to stop animation.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.6,
  amount = 0.25,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const offset = OFFSET[from];
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    shown: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Parent that staggers its direct `RevealItem` children.
 * Both parent and children must live in the same Client Component tree for
 * `staggerChildren` to propagate.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  from = "up",
  as = "li",
}: {
  children: ReactNode;
  className?: string;
  from?: Direction;
  as?: "div" | "li" | "article" | "figure";
}) {
  const reduce = useReducedMotion();
  const offset = OFFSET[from];
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, x: offset.x, y: offset.y },
              shown: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: { duration: 0.55, ease: EASE },
              },
            }
      }
    >
      {children}
    </MotionTag>
  );
}
