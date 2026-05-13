export const colors = {
  obsidian: "#050505",
  blackSand: "#0B0907",
  templeStone: "#8B7558",
  river: "#D6DEE2",
  ivory: "#F8F1E7",
  muted: "#A9A199",
  gold: "#C8A45D",
  goldSoft: "#D6B76D",
  ember: "#D97842",
  success: "#78B892",
  danger: "#E26D5C",
} as const

export const spacing = {
  sectionMobile: "5.5rem",
  sectionDesktop: "9rem",
  shell: "min(100% - 2rem, 1180px)",
} as const

export const radius = {
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  pill: "999px",
} as const

export const zIndex = {
  base: 0,
  nav: 40,
  overlay: 50,
  toast: 60,
  modal: 70,
} as const

export const gradients = {
  heroVeil:
    "linear-gradient(90deg,rgba(5,5,5,.76),rgba(5,5,5,.46),rgba(5,5,5,.08),rgba(5,5,5,.34))",
  goldLine: "linear-gradient(90deg,transparent,rgba(214,183,109,.9),transparent)",
  glass:
    "linear-gradient(135deg, rgba(255,255,255,.095), rgba(255,255,255,.035))",
} as const
