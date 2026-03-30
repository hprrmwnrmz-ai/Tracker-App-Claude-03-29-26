import { useStore } from '../store'

export function useShotCountdown() {
  const getDaysSinceLastShot = useStore((s) => s.getDaysSinceLastShot)
  const getLastShot = useStore((s) => s.getLastShot)
  const getNextSite = useStore((s) => s.getNextSite)

  const settings = useStore((s) => s.settings)
  const interval = settings.shotIntervalDays ?? 7

  const lastShot = getLastShot()
  const daysSince = getDaysSinceLastShot()
  const daysUntil = interval - daysSince
  const nextSite = getNextSite()

  // Gauge fill: 0 = just took shot (green side), 1 = overdue (red side)
  const gaugeFill = Math.min(daysSince / interval, 1)

  let statusText: string
  let subText: string

  if (!lastShot) {
    statusText = 'Log your first shot'
    subText = 'Tap Add Shot to get started'
  } else if (daysSince === 0) {
    statusText = 'Shot taken today!'
    subText = `Next shot in ${interval} day${interval !== 1 ? 's' : ''}`
  } else if (daysUntil > 0) {
    statusText = `${daysUntil} day${daysUntil !== 1 ? 's' : ''} until your shot`
    subText = `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
  } else if (daysUntil === 0) {
    statusText = 'Time for your shot'
    subText = 'Due today'
  } else {
    statusText = 'Time for your shot'
    subText = `Due ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} ago`
  }

  return { lastShot, daysSince, daysUntil, gaugeFill, statusText, subText, nextSite }
}
