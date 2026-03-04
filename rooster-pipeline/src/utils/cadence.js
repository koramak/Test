// Standard outreach cadence for Rooster Partners
// 1. Cold email (Day 1)
// 2. LinkedIn connection + note (Day 3-5)
// 3. Follow-up email if no response (Day 10-14)
// 4. Final follow-up or LinkedIn message (Day 21-28)
// 5. Mark Not a Fit or park after 4 touches with no response

const CADENCE_STEPS = [
  { step: 1, label: 'Cold email', channel: 'Email', dayMin: 0, dayMax: 0 },
  { step: 2, label: 'LinkedIn connection + note', channel: 'LinkedIn', dayMin: 3, dayMax: 5 },
  { step: 3, label: 'Follow-up email', channel: 'Email', dayMin: 10, dayMax: 14 },
  { step: 4, label: 'Final follow-up', channel: 'Email', dayMin: 21, dayMax: 28 },
]

export function getLastTouchDate(prospect) {
  if (!prospect.outreachLog || prospect.outreachLog.length === 0) return null
  const dates = prospect.outreachLog.map(e => e.date).sort()
  return dates[dates.length - 1]
}

export function daysSinceLastTouch(prospect) {
  const last = getLastTouchDate(prospect)
  if (!last) return null
  const diff = (new Date() - new Date(last)) / (1000 * 60 * 60 * 24)
  return Math.floor(diff)
}

export function getTouchCount(prospect) {
  return prospect.outreachLog ? prospect.outreachLog.length : 0
}

export function getNextCadenceStep(prospect) {
  const touches = getTouchCount(prospect)
  if (touches >= CADENCE_STEPS.length) return null
  return CADENCE_STEPS[touches]
}

export function isOverdue(prospect) {
  // Not applicable for terminal statuses
  const terminal = ['Response Received', 'Meeting Booked', 'Not a Fit']
  if (terminal.includes(prospect.status)) return false

  const touches = getTouchCount(prospect)
  if (touches === 0 && prospect.status === 'Researched') return true

  const days = daysSinceLastTouch(prospect)
  if (days === null) return false

  const nextStep = getNextCadenceStep(prospect)
  if (!nextStep) {
    // All cadence steps done, overdue if 28+ days and no resolution
    return days >= 28
  }

  return days >= nextStep.dayMin
}

export function getOverdueLabel(prospect) {
  const touches = getTouchCount(prospect)
  const days = daysSinceLastTouch(prospect)

  if (touches === 0 && prospect.status === 'Researched') {
    return 'Ready for first outreach'
  }

  const nextStep = getNextCadenceStep(prospect)
  if (!nextStep) {
    if (days >= 28) return 'All touches sent — time to close or park'
    return null
  }

  if (days >= nextStep.dayMin) {
    return `Due: ${nextStep.label} (${days} days since last touch)`
  }
  return null
}

export function getDaysUntilNextTouch(prospect) {
  const days = daysSinceLastTouch(prospect)
  if (days === null) return null
  const nextStep = getNextCadenceStep(prospect)
  if (!nextStep) return null
  return Math.max(0, nextStep.dayMin - days)
}

export { CADENCE_STEPS }
