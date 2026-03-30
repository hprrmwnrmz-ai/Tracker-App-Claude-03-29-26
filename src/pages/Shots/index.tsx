import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { ShotFormModal } from './ShotForm'
import { ShotEntry } from '../../types/shot'
import { INJECTION_SITE_LABELS } from '../../types/shot'
import { formatDate, formatDose } from '../../utils/formatters'

const DOSE_COLORS: Record<string, string> = {
  '2.5': '#94a3b8',
  '3.25': '#60a5fa',
  '5': '#2B9FD9',
  '7.5': '#8b5cf6',
  '10': '#f59e0b',
  '12.5': '#f97316',
  '15': '#ef4444',
}

function getDoseColor(dose: number): string {
  return DOSE_COLORS[String(dose)] ?? '#6b7280'
}

export function ShotsPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ShotEntry | undefined>()

  const shots = useStore((s) => s.shots)
  const deleteShot = useStore((s) => s.deleteShot)

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (shot: ShotEntry) => { setEditing(shot); setModalOpen(true) }

  return (
    <div className="page-content">
      <PageHeader
        title="Shots"
        onMenuClick={openDrawer}
        action={
          <button onClick={openAdd} className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Add
          </button>
        }
      />

      <div className="px-4 py-4 space-y-3">
        {shots.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💉</p>
            <p className="font-medium">No shots logged yet</p>
            <p className="text-sm mt-1">Tap + Add to log your first shot</p>
          </div>
        )}

        {shots.map((shot) => (
          <Card key={shot.id} padding={false}>
            <div className="flex items-center gap-3 p-4">
              {/* Dose badge */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                style={{ backgroundColor: getDoseColor(shot.dose) }}
              >
                {shot.dose}mg
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{formatDate(shot.timestamp)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{INJECTION_SITE_LABELS[shot.site]}</p>
                {shot.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{shot.notes}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(shot)}
                  className="p-2 text-gray-400 active:opacity-60"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteShot(shot.id)}
                  className="p-2 text-red-400 active:opacity-60"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ShotFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  )
}
