import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { FoodFormModal } from './FoodForm'
import { FoodEntry, MealType } from '../../types/food'

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
const MEAL_ICONS: Record<MealType, string> = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' }

export function FoodPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FoodEntry | undefined>()

  const getFoodsForDate = useStore((s) => s.getFoodsForDate)
  const getDailyTotals = useStore((s) => s.getDailyTotals)
  const deleteFood = useStore((s) => s.deleteFood)

  const entries = getFoodsForDate(currentDate)
  const totals = getDailyTotals(currentDate)
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="page-content">
      <PageHeader title="Food Log" onMenuClick={openDrawer}
        action={
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Add
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Date nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="p-2 text-gray-500 active:opacity-60">
            <ChevronLeft size={20} />
          </button>
          <p className="font-semibold text-gray-900">
            {isToday ? 'Today' : format(currentDate, 'EEEE, MMM d')}
          </p>
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-2 text-gray-500 active:opacity-60">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Daily totals */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Cal', value: totals.calories },
            { label: 'Protein', value: `${totals.proteinG}g` },
            { label: 'Carbs', value: `${totals.carbsG}g` },
            { label: 'Fat', value: `${totals.fatG}g` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Meals */}
        {MEAL_ORDER.map((meal) => {
          const mealEntries = entries.filter((e) => e.mealType === meal)
          return (
            <div key={meal}>
              <div className="flex items-center gap-2 mb-2">
                <span>{MEAL_ICONS[meal]}</span>
                <span className="text-sm font-semibold text-gray-700 capitalize">{meal}</span>
              </div>
              {mealEntries.length > 0 ? (
                <div className="space-y-2">
                  {mealEntries.map((entry) => (
                    <Card key={entry.id} padding={false}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{entry.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {entry.calories} cal · {entry.proteinG}g protein
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditing(entry); setModalOpen(true) }} className="p-1.5 text-gray-400">✏️</button>
                          <button onClick={() => deleteFood(entry.id)} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
                  className="w-full text-left px-4 py-3 bg-white rounded-2xl shadow-sm text-sm text-gray-400 active:opacity-70">
                  + Add {meal}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <FoodFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} defaultDate={currentDate} />
    </div>
  )
}
