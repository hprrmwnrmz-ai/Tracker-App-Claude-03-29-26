import { ReactNode } from 'react'
import { MenuIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
  onMenuClick?: () => void
}

export function PageHeader({ title, action, onMenuClick }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
      <button
        onClick={onMenuClick}
        className="p-1 -ml-1 text-gray-600 active:opacity-60"
        aria-label="Open menu"
      >
        <MenuIcon size={22} strokeWidth={2} />
      </button>
      <h1 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h1>
      <div className="min-w-[60px] flex justify-end">
        {action}
      </div>
    </header>
  )
}
