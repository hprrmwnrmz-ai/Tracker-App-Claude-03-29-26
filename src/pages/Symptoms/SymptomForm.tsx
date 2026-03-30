import { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { SymptomEntry, COMMON_SYMPTOMS, Severity } from '../../types/symptom'

interface SymptomFormModalProps {
  open: boolean
  onClose: () => void
  editing?: SymptomEntry
}

export function SymptomFormModal({ open, onClose, editing }: SymptomFormModalProps) {
  const addSymptom = useStore((s) => s.addSymptom)
  const updateSymptom = useStore((s) => s.updateSymptom)

  const [selected, setSelected] = useState<string[]>(editing?.symptoms ?? [])
  const [severity, setSeverity] = useState<Severity>(editing?.severity ?? 3)
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [timestamp, setTimestamp] = useState(
    editing?.timestamp
      ? format(new Date(editing.timestamp), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )

  const toggleSymptom = (s: string) =>
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const handleSubmit = () => {
    const entry = { symptoms: selected, severity, notes, timestamp: new Date(timestamp).toISOString() }
    if (editing) updateSymptom(editing.id, entry)
    else addSymptom(entry)
    onClose()
  }

  const submitButton = (
    <button onClick={handleSubmit} disabled={selected.length === 0}
      className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80 disabled:opacity-50"
      style={{ backgroundColor: 'var(--accent-color)' }}>
      {editing ? 'Save Changes' : 'Log Side Effects'}
    </button>
  )

  return (
    <Modal open={open} onClose={onClose} title="Log Side Effects" footer={submitButton}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Symptoms</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((s) => (
              <button key={s} onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selected.includes(s) ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Severity</label>
          <div className="mt-2 flex gap-2">
            {([1, 2, 3, 4, 5] as Severity[]).map((n) => (
              <button key={n} onClick={() => setSeverity(n)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${
                  severity === n ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500'
                }`}>
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400 px-1">
            <span>Mild</span><span>Severe</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
          <input type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional..."
            rows={2} className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent resize-none" />
        </div>

      </div>
    </Modal>
  )
}
