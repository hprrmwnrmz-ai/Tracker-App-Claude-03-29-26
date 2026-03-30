import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { ExerciseEntry } from '../../types/exercise'
import { EXERCISE_TYPE_ICONS, EXERCISE_TYPE_LABELS } from '../../types/exercise'
import { formatDate, formatDuration } from '../../utils/formatters'
import { ExerciseFormModal } from './ExerciseForm'

const INTENSITY_COLORS: Record<string, string> = {
  light: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}

export function ExercisePage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ExerciseEntry | undefined>()

  const exercises = useStore((s) => s.exercises)
  const deleteExercise = useStore((s) => s.deleteExercise)
  const getWeeklyStats = useStore((s) => s.getWeeklyStats)

  const stats = getWeeklyStats()

  return (
    <div className="page-content">
      <PageHeader title="Exercise" onMenuClick={openDrawer}
        action={
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Add
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Weekly stats */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="text-center">
            <p className="text-xs text-gray-500">This week</p>
            <p className="text-xl font-bold text-gray-900">{stats.count}</p>
            <p className="text-xs text-gray-400">workouts</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-gray-500">Total time</p>
            <p className="text-xl font-bold text-gray-900">{formatDuration(stats.totalMinutes)}</p>
            <p className="text-xs text-gray-400">this week</p>
          </Card>
        </div>

        {/* Log */}
        {exercises.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏃</p>
            <p className="font-medium">No workouts logged yet</p>
          </div>
        )}
        <div className="space-y-2">
          {exercises.map((e) => (
            <Card key={e.id} padding={false}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">{EXERCISE_TYPE_ICONS[e.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{EXERCISE_TYPE_LABELS[e.type]}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INTENSITY_COLORS[e.intensity]}`}>
                      {e.intensity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDuration(e.durationMinutes)}
                    {e.caloriesBurned ? ` · ${e.caloriesBurned} cal` : ''}
                    {' · '}{formatDate(e.timestamp)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(e); setModalOpen(true) }} className="p-1.5 text-gray-400"><Pencil size={14} /></button>
                  <button onClick={() => deleteExercise(e.id)} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ExerciseFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  )
}
