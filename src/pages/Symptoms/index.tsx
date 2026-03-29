import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { SymptomFormModal } from './SymptomForm'
import { SymptomEntry } from '../../types/symptom'
import { formatDate } from '../../utils/formatters'

const SEVERITY_COLORS = ['', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700',
  'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700', 'bg-red-200 text-red-800']

export function SymptomsPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SymptomEntry | undefined>()

  const symptoms = useStore((s) => s.symptoms)
  const deleteSymptom = useStore((s) => s.deleteSymptom)

  return (
    <div className="page-content">
      <PageHeader title="Side Effects" onMenuClick={openDrawer}
        action={
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Add
          </button>
        }
      />

      <div className="px-4 py-4 space-y-3">
        {symptoms.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🌊</p>
            <p className="font-medium">No side effects logged</p>
            <p className="text-sm mt-1">Tap + Add to log symptoms</p>
          </div>
        )}
        {symptoms.map((s) => (
          <Card key={s.id} padding={false}>
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_COLORS[s.severity]}`}>
                      Severity {s.severity}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(s.timestamp)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.symptoms.map((sym, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{sym}</span>
                    ))}
                  </div>
                  {s.notes && <p className="text-xs text-gray-400 mt-1.5">{s.notes}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditing(s); setModalOpen(true) }} className="p-1.5 text-gray-400">✏️</button>
                  <button onClick={() => deleteSymptom(s.id)} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SymptomFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  )
}
