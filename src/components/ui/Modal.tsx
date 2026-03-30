import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet — sits above the bottom nav bar */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl z-10 flex flex-col"
           style={{ maxHeight: 'calc(92vh - 64px - env(safe-area-inset-bottom))', marginBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 active:opacity-60">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>

        {/* Sticky footer (submit button lives here) */}
        {footer && (
          <div className="flex-shrink-0 px-5 pt-2 border-t border-gray-100"
               style={{ paddingBottom: '20px' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
