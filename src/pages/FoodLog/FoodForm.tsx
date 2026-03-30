import { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { FoodEntry, MealType } from '../../types/food'

interface FoodFormModalProps {
  open: boolean
  onClose: () => void
  editing?: FoodEntry
  defaultDate?: Date
}

const MEAL_TYPES: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { value: 'lunch',     label: 'Lunch',     icon: '🥗' },
  { value: 'dinner',    label: 'Dinner',    icon: '🍽️' },
  { value: 'snack',     label: 'Snack',     icon: '🍎' },
]

export function FoodFormModal({ open, onClose, editing, defaultDate }: FoodFormModalProps) {
  const addFood = useStore((s) => s.addFood)
  const updateFood = useStore((s) => s.updateFood)

  const [mealType, setMealType] = useState<MealType>(editing?.mealType ?? 'lunch')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [calories, setCalories] = useState(String(editing?.calories ?? ''))
  const [protein, setProtein] = useState(String(editing?.proteinG ?? ''))
  const [carbs, setCarbs] = useState(String(editing?.carbsG ?? ''))
  const [fat, setFat] = useState(String(editing?.fatG ?? ''))
  const [timestamp, setTimestamp] = useState(
    editing?.timestamp
      ? format(new Date(editing.timestamp), "yyyy-MM-dd'T'HH:mm")
      : format(defaultDate ?? new Date(), "yyyy-MM-dd'T'HH:mm")
  )

  const handleSubmit = () => {
    const entry = {
      mealType, description, notes: '',
      calories: parseInt(calories) || 0,
      proteinG: parseFloat(protein) || 0,
      carbsG: parseFloat(carbs) || 0,
      fatG: parseFloat(fat) || 0,
      timestamp: new Date(timestamp).toISOString(),
    }
    if (editing) updateFood(editing.id, entry)
    else addFood(entry)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Food' : 'Log Food'}>
      <div className="space-y-4">
        {/* Meal type */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Meal</label>
          <div className="mt-1.5 grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(({ value, label, icon }) => (
              <button key={value} onClick={() => setMealType(value)}
                className={`flex flex-col items-center py-2 rounded-xl border text-xs font-medium transition-colors ${
                  mealType === value ? 'border-accent text-accent bg-accent/10' : 'border-gray-200 text-gray-600'
                }`}>
                <span className="text-lg">{icon}</span>
                <span className="mt-0.5">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you eat?" className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Calories</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)}
              placeholder="0" className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Protein (g)</label>
            <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)}
              placeholder="0" className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Carbs (g)</label>
            <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)}
              placeholder="0" className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fat (g)</label>
            <input type="number" value={fat} onChange={(e) => setFat(e.target.value)}
              placeholder="0" className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</label>
          <input type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <button onClick={handleSubmit}
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80"
          style={{ backgroundColor: 'var(--accent-color)' }}>
          {editing ? 'Save Changes' : 'Log Food'}
        </button>
      </div>
    </Modal>
  )
}
