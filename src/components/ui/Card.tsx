import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  padding?: boolean
}

export function Card({ children, className = '', onClick, padding = true }: CardProps) {
  const base = `bg-white rounded-2xl shadow-sm ${padding ? 'p-4' : ''} ${className}`
  if (onClick) {
    return (
      <button className={`${base} w-full text-left active:opacity-70 transition-opacity`} onClick={onClick}>
        {children}
      </button>
    )
  }
  return <div className={base}>{children}</div>
}
