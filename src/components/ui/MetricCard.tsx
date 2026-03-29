interface MetricCardProps {
  icon: string
  label: string
  value?: string | number
  unit?: string
  placeholder?: string
  onClick?: () => void
}

export function MetricCard({ icon, label, value, unit, placeholder = '—', onClick }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-3 flex flex-col gap-1 text-left active:opacity-70 transition-opacity shadow-sm"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <div className="mt-0.5">
        {value !== undefined && value !== null && value !== '' ? (
          <span className="text-sm font-semibold text-gray-900">
            {value}{unit && <span className="text-xs font-normal text-gray-500 ml-0.5">{unit}</span>}
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-400">{placeholder}</span>
        )}
      </div>
    </button>
  )
}
