import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy')
}

export function formatDateShort(iso: string): string {
  return format(parseISO(iso), 'MMM d')
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy h:mm a')
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function formatWeight(lbs: number, unit: 'lbs' | 'kg' = 'lbs'): string {
  if (unit === 'kg') return `${(lbs * 0.453592).toFixed(1)} kg`
  return `${lbs} lbs`
}

export function formatDose(dose: number): string {
  return `${dose}mg`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function todayISODate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
