import { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { ExerciseEntry, ExerciseType, Intensity, EXERCISE_TYPE_LABELS, EXERCISE_TYPE_ICONS } from '../../types/exercise'

interface ExerciseFormModalProps {
  open: boolean
  onClose: () => void
  editing?: ExerciseEntry
}

const TYPES = Object.entries(EXERCISE_TYPE_LABELS) as [ExerciseType, string][]
const INTENSITIES: Intensity[] = ['light', 'moderate', 'hard']

export function ExerciseFormModal({ open, onClose, editing }: ExerciseFormModalProps) {
  const addExercise = useStore((s) => s.addExercise)
  const updateExercise = useStore((s) => s.updateExercise)

  const [type, setType] = useState<ExerciseType>(editing?.type ?? 'walk')
  const [duration, setDuration] = useState(String(editing?.durationMinutes ?? '30'))
  const [intensity, setIntensity] = useState<Intensity>(editing?.intensity ?? 'moderate')
  const [calories, setCalories] = useState(String(editing?.caloriesBurned ?? ''))
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [timestamp, setTimestamp] = useState(
    editing?.timestamp
      ? format(new Date(editing.timestamp), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )

  const handleSubmit = () => {
    const entry = { type, durationMinutes: parseInt(duration) || 0, intensity,
      caloriesBurned: calories ? parseInt(calories) : undefined, notes,
      timestamp: new Date(timestamp).toISOString() }
    if (editing) updateExercise(editing.id, entry)
    else addExercise(entry)
    onClose()
  }

  const submitButton = (
    <button onClick={handleSubmit}
      className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80"
      style={{ backgroundColor: 'var(--accent-color)' }}>
      {editing ? 'Save Changes' : 'Log Workout'}
    </button>
  )

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Workout' : 'Log Workout'} footer={submitButton}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Activity</label>
          <div className="mt-1.5 grid grid-cols-5 gap-1.5">
            {TYPES.map(([val, label]) => (
              <button key={val} onClick={() => setType(val)}
                className={`flex flex-col items-center py-2 rounded-xl border text-xs transition-colors ${
                  type === val ? 'border-accent text-accent bg-accent/10' : 'border-gray-200 text-gray-600'
                }`}>
                <span className="text-lg">{EXERCISE_TYPE_ICONS[val]}</span>
                <span className="mt-0.5 text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration (min)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30"
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Calories (opt)</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="—"
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Intensity</label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {INTENSITIES.map((i) => (
              <button key={i} onClick={() => setIntensity(i)}
                className={`py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                  intensity === i ? 'border-accent text-accent bg-accent/10' : 'border-gray-200 text-gray-600'
                }`}>
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</label>
          <input type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

      </div>
    </Modal>
  )
}
