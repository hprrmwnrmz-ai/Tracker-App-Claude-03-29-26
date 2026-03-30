import { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { InjectionSite, INJECTION_SITE_LABELS, INJECTION_SITE_ROTATION, ShotEntry } from '../../types/shot'

interface ShotFormModalProps {
  open: boolean
  onClose: () => void
  editing?: ShotEntry
}

export function ShotFormModal({ open, onClose, editing }: ShotFormModalProps) {
  const addShot = useStore((s) => s.addShot)
  const updateShot = useStore((s) => s.updateShot)
  const getNextSite = useStore((s) => s.getNextSite)
  const settings = useStore((s) => s.settings)

  const [dose, setDose] = useState(String(editing?.dose ?? settings.currentDose))
  const [site, setSite] = useState<InjectionSite>(editing?.site ?? getNextSite())
  const [timestamp, setTimestamp] = useState(
    editing?.timestamp
      ? format(new Date(editing.timestamp), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )
  const [notes, setNotes] = useState(editing?.notes ?? '')

  const handleSubmit = () => {
    const entry = { dose: parseFloat(dose) || 0, site, timestamp: new Date(timestamp).toISOString(), notes }
    if (editing) updateShot(editing.id, entry)
    else addShot(entry)
    onClose()
  }

  const submitButton = (
    <button
      onClick={handleSubmit}
      className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80 transition-opacity"
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      {editing ? 'Save Changes' : 'Log Shot'}
    </button>
  )

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Shot' : 'Log Shot'} footer={submitButton}>
      <div className="space-y-4">
        {/* Date/time */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</label>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-accent"
          />
        </div>

        {/* Dose */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dose (mg)</label>
          <input
            type="number"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            step="0.25"
            min="0"
            placeholder="e.g. 5"
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-accent"
          />
        </div>

        {/* Injection site */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Injection Site</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {INJECTION_SITE_ROTATION.map((s) => (
              <button
                key={s}
                onClick={() => setSite(s)}
                className={`text-xs py-2.5 px-3 rounded-xl border font-medium text-left transition-colors ${
                  site === s
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {INJECTION_SITE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            rows={2}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-accent resize-none"
          />
        </div>
      </div>
    </Modal>
  )
}
