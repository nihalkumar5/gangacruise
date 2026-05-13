export const motionDurations = {
  instant: 0.12,
  fast: 0.22,
  base: 0.42,
  slow: 0.72,
  cinematic: 1.15,
  chapter: 1.6,
} as const

export const motionEasings = {
  silk: [0.16, 1, 0.3, 1],
  river: [0.22, 1, 0.36, 1],
  glass: [0.32, 0.72, 0, 1],
  entrance: [0.19, 1, 0.22, 1],
  exit: [0.7, 0, 0.84, 0],
} as const

export const revealTransition = {
  duration: motionDurations.slow,
  ease: motionEasings.silk,
}
