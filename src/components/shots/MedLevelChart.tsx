import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { format, subDays, addDays } from 'date-fns'
import { Info } from 'lucide-react'
import { ShotEntry } from '../../types/shot'

// ── Tirzepatide (Zepbound) pharmacokinetics ───────────────────────────────────
// Half-life: ~5 days (120 h)   |   Tmax: ~48 h   |   SC bioavailability: ~80%
const KE = Math.log(2) / (5 * 24)   // per-hour elimination rate
const PEAK_H = 48                    // hours to peak
const F = 0.80                       // bioavailability fraction

function shotLevelAt(dose: number, hoursSince: number): number {
  if (hoursSince < 0) return 0
  if (hoursSince < PEAK_H) return dose * F * (hoursSince / PEAK_H)
  return dose * F * Math.exp(-KE * (hoursSince - PEAK_H))
}

export function totalMedLevel(shots: ShotEntry[], at: Date): number {
  return shots.reduce((sum, s) => {
    const h = (at.getTime() - new Date(s.timestamp).getTime()) / 3_600_000
    return sum + shotLevelAt(s.dose, h)
  }, 0)
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Range = 'week' | 'month' | '90days' | 'alltime'

const RANGES: { key: Range; label: string }[] = [
  { key: 'week',    label: 'Week' },
  { key: 'month',   label: 'Month' },
  { key: '90days',  label: '90 days' },
  { key: 'alltime', label: 'All time' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export function MedLevelChart({ shots }: { shots: ShotEntry[] }) {
  const [range, setRange] = useState<Range>('90days')
  const [showInfo, setShowInfo] = useState(false)
  const now = useMemo(() => new Date(), [])

  const currentLevel = useMemo(() => totalMedLevel(shots, now), [shots])

  const data = useMemo(() => {
    if (shots.length === 0) return []

    let startDate: Date
    let intervalHours: number

    if (range === 'week')       { startDate = subDays(now, 7);  intervalHours = 6  }
    else if (range === 'month') { startDate = subDays(now, 30); intervalHours = 12 }
    else if (range === '90days'){ startDate = subDays(now, 90); intervalHours = 24 }
    else {
      const first = [...shots].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )[0]
      startDate = first ? subDays(new Date(first.timestamp), 2) : subDays(now, 90)
      intervalHours = 24
    }

    const endDate = addDays(now, 8)
    const nowMs = now.getTime()
    const pts: { time: number; past: number | null; future: number | null }[] = []
    let cur = startDate.getTime()

    while (cur <= endDate.getTime()) {
      const d = new Date(cur)
      const lvl = +totalMedLevel(shots, d).toFixed(3)
      pts.push({
        time: cur,
        past:   cur <= nowMs ? lvl : null,
        future: cur >= nowMs ? lvl : null,
      })
      cur += intervalHours * 3_600_000
    }

    return pts
  }, [shots, range])

  const xFmt = (ms: number) => format(new Date(ms), range === 'week' ? 'MMM d' : 'MMM d')

  if (shots.length === 0) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900">Estimated Medication Levels</span>
            <button onClick={() => setShowInfo(!showInfo)}>
              <Info size={14} className="text-gray-400" />
            </button>
          </div>
          {showInfo && (
            <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
              Modeled using tirzepatide's ~5-day half-life and ~48 h time-to-peak.
              For reference only — not medical advice.
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold" style={{ color: 'var(--accent-color)' }}>
            {currentLevel.toFixed(2)}mg
          </p>
          <p className="text-xs text-gray-400">Est. current</p>
        </div>
      </div>

      {/* Range tabs */}
      <div className="flex bg-gray-100 rounded-lg p-0.5 mb-3">
        {RANGES.map(r => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              range === r.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 2, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gradPast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--accent-color)" stopOpacity={0.40} />
              <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradFuture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--accent-color)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            tickFormatter={xFmt}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            minTickGap={50}
          />
          <YAxis
            orientation="right"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}mg`}
            width={38}
          />
          <Tooltip
            labelFormatter={(ms) => format(new Date(ms as number), 'MMM d, yyyy')}
            formatter={(val) => [`${Number(val).toFixed(2)} mg`, 'Est. level']}
            contentStyle={{
              fontSize: 12, borderRadius: 10, border: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
            }}
          />

          {/* "Now" reference line */}
          <ReferenceLine x={now.getTime()} stroke="#d1d5db" strokeDasharray="3 3" strokeWidth={1} />

          {/* Past – solid filled area */}
          <Area
            type="monotone"
            dataKey="past"
            stroke="var(--accent-color)"
            strokeWidth={2}
            fill="url(#gradPast)"
            connectNulls={false}
            dot={false}
            activeDot={{ r: 4, fill: 'var(--accent-color)' }}
            isAnimationActive={false}
          />

          {/* Future – dashed, lighter fill */}
          <Area
            type="monotone"
            dataKey="future"
            stroke="var(--accent-color)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            strokeOpacity={0.6}
            fill="url(#gradFuture)"
            connectNulls={false}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
