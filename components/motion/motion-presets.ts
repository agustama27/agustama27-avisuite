export const springSm = { type: "spring" as const, stiffness: 260, damping: 20 }
export const springMd = { type: "spring" as const, stiffness: 220, damping: 22 }

export const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: springSm },
}

export const staggerContainer = (opts?: { delayChildren?: number; staggerChildren?: number }) => ({
  hidden: {},
  show: {
    transition: {
      delayChildren: opts?.delayChildren ?? 0.04,
      staggerChildren: opts?.staggerChildren ?? 0.06,
    },
  },
})

export const cardHover = {
  whileHover: { y: -2, scale: 1.01 },
  transition: springSm,
}

export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springSm,
}
