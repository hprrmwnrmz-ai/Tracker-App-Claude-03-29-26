import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  onSeeAll?: () => void
  action?: ReactNode
}

export function SectionHeader({ title, onSeeAll, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="flex items-center gap-0.5 text-sm font-medium text-accent active:opacity-60"
        >
          See all <ChevronRight size={16} />
        </button>
      )}
      {action}
    </div>
  )
}
