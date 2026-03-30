import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Modal } from '../../components/ui/Modal'
import { INJECTION_SITE_LABELS } from '../../types/shot'
import { BILL_CATEGORY_ICONS } from '../../types/bill'
import { EXERCISE_TYPE_ICONS } from '../../types/exercise'

interface DayEvents {
  shots: { dose: number }[]
  billsDue: { name: string; paid: boolean }[]
  billsPaid: { name: string }[]
  exercises: { type: string }[]
  workNotes: { title: string }[]
}

export function CalendarPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const shots = useStore((s) => s.shots)
  const bills = useStore((s) => s.bills)
  const billPayments = useStore((s) => s.billPayments)
  const exercises = useStore((s) => s.exercises)
  const workNotes = useStore((s) => s.workNotes)
  const getBillsDueThisMonth = useStore((s) => s.getBillsDueThisMonth)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart) // 0=Sun

  const getEventsForDay = (day: Date): DayEvents => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const monthYear = format(day, 'MMMM yyyy')

    const dayShots = shots.filter((s) => s.timestamp.startsWith(dateStr)).map((s) => ({ dose: s.dose }))
    const dayBillsPaid = billPayments
      .filter((p) => p.paidDate.startsWith(dateStr))
      .map((p) => {
        const bill = bills.find((b) => b.id === p.billId)
        return { name: bill?.name ?? 'Bill' }
      })
    const dayBillsDue = getBillsDueThisMonth()
      .filter(({ dueDate }) => isSameDay(dueDate, day))
      .map(({ bill, paid }) => ({ name: bill.name, paid }))
    const dayExercises = exercises.filter((e) => e.timestamp.startsWith(dateStr)).map((e) => ({ type: e.type }))
    const dayWork = workNotes.filter((n) => n.timestamp.startsWith(dateStr)).map((n) => ({ title: n.title }))

    return { shots: dayShots, billsDue: dayBillsDue, billsPaid: dayBillsPaid, exercises: dayExercises, workNotes: dayWork }
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : null

  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="page-content">
      <PageHeader title="Calendar" onMenuClick={openDrawer} />

      <div className="px-4 py-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 text-gray-500 active:opacity-60">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-base font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 text-gray-500 active:opacity-60">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day of week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DOW.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {/* Padding cells */}
          {Array.from({ length: startPadding }).map((_, i) => <div key={`pad-${i}`} />)}

          {days.map((day) => {
            const events = getEventsForDay(day)
            const hasShot = events.shots.length > 0
            const hasBillDue = events.billsDue.some((b) => !b.paid)
            const hasBillOverdue = events.billsDue.some((b) => !b.paid && day < new Date())
            const hasBillPaid = events.billsPaid.length > 0 || events.billsDue.some((b) => b.paid)
            const hasExercise = events.exercises.length > 0
            const hasWork = events.workNotes.length > 0
            const today = isToday(day)
            const selected = selectedDay && isSameDay(selectedDay, day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date(0)) ? null : day)}
                className={`relative flex flex-col items-center pt-1.5 pb-2 rounded-xl transition-colors ${
                  selected ? 'bg-accent/10' : today ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm font-medium ${today ? 'text-accent font-bold' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                {/* Event dots */}
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                  {hasShot && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  {hasBillOverdue && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  {hasBillDue && !hasBillOverdue && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  {hasBillPaid && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                  {hasExercise && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                  {hasWork && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 px-1">
          {[
            { color: 'bg-blue-500', label: 'Shot' },
            { color: 'bg-green-500', label: 'Bill paid' },
            { color: 'bg-orange-400', label: 'Bill due' },
            { color: 'bg-red-500', label: 'Overdue' },
            { color: 'bg-purple-500', label: 'Exercise' },
            { color: 'bg-yellow-400', label: 'Work' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDay && (
        <Modal open={!!selectedDay} onClose={() => setSelectedDay(null)} title={format(selectedDay, 'EEEE, MMMM d')}>
          {selectedEvents && (
            <div className="space-y-3">
              {selectedEvents.shots.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-xl">💉</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Shot — {s.dose}mg</p>
                  </div>
                </div>
              ))}
              {selectedEvents.billsDue.map((b, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${b.paid ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <span className="text-xl">{b.paid ? '✅' : '🔔'}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.paid ? 'Paid' : 'Due'}</p>
                  </div>
                </div>
              ))}
              {selectedEvents.exercises.map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <span className="text-xl">{EXERCISE_TYPE_ICONS[e.type as keyof typeof EXERCISE_TYPE_ICONS] ?? '💪'}</span>
                  <p className="font-semibold text-gray-900 text-sm capitalize">{e.type}</p>
                </div>
              ))}
              {selectedEvents.workNotes.map((n, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                  <span className="text-xl">💼</span>
                  <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                </div>
              ))}
              {Object.values(selectedEvents).every((arr) => arr.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-4">No events on this day</p>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
