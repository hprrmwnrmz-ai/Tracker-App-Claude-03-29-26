import { NavLink } from 'react-router-dom'
import { ClipboardList, Syringe, BarChart2, Calendar, Settings } from 'lucide-react'

const tabs = [
  { to: '/summary',  label: 'Summary',  Icon: ClipboardList },
  { to: '/shots',    label: 'Shots',    Icon: Syringe },
  { to: '/results',  label: 'Results',  Icon: BarChart2 },
  { to: '/calendar', label: 'Calendar', Icon: Calendar },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 z-50"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
