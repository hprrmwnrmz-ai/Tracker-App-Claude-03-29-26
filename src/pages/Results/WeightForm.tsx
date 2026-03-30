import { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { WeightEntry } from '../../types/weight'

interface WeightFormModalProps {
  open: boolean
  onClose: () => void
  editing?: WeightEntry
}

export function WeightFormModal({ open, onClose, editing }: WeightFormModalProps) {
  const addWeight = useStore((s) => s.addWeight)
  const updateWeight = useStore((s) => s.updateWeight)

  const [weight, setWeight] = useState(String(editing?.weightLbs ?? ''))
  const [timestamp, setTimestamp] = useState(
    editing?.timestamp
      ? format(new Date(editing.timestamp), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )
  const [notes, setNotes] = useState(editing?.notes ?? '')

  const handleSubmit = () => {
    const entry = { weightLbs: parseFloat(weight) || 0, timestamp: new Date(timestamp).toISOString(), notes }
    if (editing) updateWeight(editing.id, entry)
    else addWeight(entry)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Weight' : 'Log Weight'}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight (lbs)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            placeholder="e.g. 185.5"
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</label>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional..."
            rows={2}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent resize-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          {editing ? 'Save Changes' : 'Log Weight'}
        </button>
      </div>
    </Modal>
  )
}
