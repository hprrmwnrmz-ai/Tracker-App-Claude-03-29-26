import { useShotCountdown } from '../../hooks/useShotCountdown'
import { INJECTION_SITE_LABELS } from '../../types/shot'

interface ShotGaugeProps {
  onAddShot: () => void
}

export function ShotGauge({ onAddShot }: ShotGaugeProps) {
  const { gaugeFill, statusText, subText, nextSite } = useShotCountdown()

  // SVG arc parameters
  const cx = 160
  const cy = 160
  const r = 120
  const strokeWidth = 18

  // Arc goes from 180° (left) to 0° (right) — a top semicircle
  // We map gaugeFill 0→1 to show how "full" the week is
  // At fill=0 (just took shot), gauge is at the green (right) side
  // At fill=1 (7 days), gauge fills all the way to red (left)

  const totalArcLength = Math.PI * r
  // strokeDasharray = total arc, strokeDashoffset = how much to hide
  const dashArray = totalArcLength
  const dashOffset = totalArcLength * (1 - Math.min(gaugeFill, 1))

  // Color stops for the rainbow gradient
  // left=red(overdue), right=green(just took)

  return (
    <div className="flex flex-col items-center pt-6 pb-4 px-4 bg-white">
      <div className="relative w-full max-w-[320px]">
        <svg
          viewBox="0 0 320 170"
          className="w-full overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ef4444" />
              <stop offset="25%"  stopColor="#f97316" />
              <stop offset="50%"  stopColor="#eab308" />
              <stop offset="75%"  stopColor="#84cc16" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            {/* Gray track */}
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#f3f4f6" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored gauge arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
          <p className="text-xl font-bold text-gray-900 text-center leading-tight px-8">
            {statusText}
          </p>
          <p className="text-sm text-gray-500 mt-1">{subText}</p>

          <button
            onClick={onAddShot}
            className="mt-4 px-8 py-2.5 rounded-full text-white font-semibold text-sm shadow-md active:opacity-80 transition-opacity"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            Add Shot
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Next site: <span className="font-medium text-gray-700">{INJECTION_SITE_LABELS[nextSite]}</span>
      </p>
    </div>
  )
}
