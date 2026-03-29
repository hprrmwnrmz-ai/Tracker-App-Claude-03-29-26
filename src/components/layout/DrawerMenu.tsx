import { useNavigate } from 'react-router-dom'
import { X, Utensils, Camera, Activity, Receipt, Dumbbell, Briefcase, FileDown } from 'lucide-react'

interface DrawerMenuProps {
  open: boolean
  onClose: () => void
}

const drawerItems = [
  { to: '/food',     label: 'Food Log',       Icon: Utensils,  color: 'text-orange-500' },
  { to: '/symptoms', label: 'Side Effects',   Icon: Activity,  color: 'text-red-500' },
  { to: '/bills',    label: 'Bills',          Icon: Receipt,   color: 'text-green-600' },
  { to: '/exercise', label: 'Exercise',       Icon: Dumbbell,  color: 'text-purple-600' },
  { to: '/work',     label: 'Work Notes',     Icon: Briefcase, color: 'text-yellow-600' },
  { to: '/photos',   label: 'Progress Photos',Icon: Camera,    color: 'text-pink-500' },
]

export function DrawerMenu({ open, onClose }: DrawerMenuProps) {
  const navigate = useNavigate()

  const handleNav = (to: string) => {
    navigate(to)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ maxWidth: '80vw' }}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Slate</span>
          <button onClick={onClose} className="p-1 text-gray-400 active:opacity-60">
            <X size={20} />
          </button>
        </div>

        <nav className="py-3">
          <p className="px-5 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            More Trackers
          </p>
          {drawerItems.map(({ to, label, Icon, color }) => (
            <button
              key={to}
              onClick={() => handleNav(to)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <span className={`${color}`}>
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="text-gray-800 font-medium">{label}</span>
            </button>
          ))}

          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleNav('/settings')}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <span className="text-gray-400">
                <FileDown size={20} strokeWidth={2} />
              </span>
              <span className="text-gray-600 font-medium">Export Data</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
