'use client'

// ─────────────────────────────────────────────────────────────
// Motion Wrappers — Client boundary for Framer Motion
// ─────────────────────────────────────────────────────────────
//
// 🧠 WHY THIS EXISTS:
// Framer Motion v11 uses React's new "use client" directive
// internally, but when Next.js tries to bundle it for Server
// Components it can't find the motion components in its
// Client Manifest — causing the error you saw.
//
// The fix: re-export motion components from a file that is
// explicitly marked 'use client'. This creates a clear
// client boundary that Next.js's bundler can understand.
//
// Usage in any component (server OR client):
//   import { MotionDiv, MotionSection } from '@/components/ui/Motion'
//   <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
// ─────────────────────────────────────────────────────────────

export { motion, AnimatePresence } from 'framer-motion'

// Pre-typed motion element exports — saves importing `motion`
// and calling motion.div, motion.section etc. everywhere
import { motion } from 'framer-motion'

export const MotionDiv     = motion.div
export const MotionSection = motion.section
export const MotionNav     = motion.nav
export const MotionUl      = motion.ul
export const MotionLi      = motion.li
export const MotionH1      = motion.h1
export const MotionH2      = motion.h2
export const MotionP       = motion.p
export const MotionSpan    = motion.span
export const MotionA       = motion.a
