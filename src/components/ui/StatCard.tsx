interface StatCardProps {
  icon: string
  label: string
  value: string | number
  unit?: string
  accent?: boolean
}

export function StatCard({ icon, label, value, unit, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <span className={`text-xs font-medium ${accent ? 'text-accent' : 'text-gray-500'}`}>{label}</span>
      </div>
      <div className="mt-0.5">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {unit && <span className="text-xs text-gray-500 ml-0.5">{unit}</span>}
      </div>
    </div>
  )
}
