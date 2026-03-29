import { useState } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { WorkNote } from '../../types/work'

interface WorkNoteFormModalProps {
  open: boolean
  onClose: () => void
  editing?: WorkNote
}

export function WorkNoteFormModal({ open, onClose, editing }: WorkNoteFormModalProps) {
  const addWorkNote = useStore((s) => s.addWorkNote)
  const updateWorkNote = useStore((s) => s.updateWorkNote)

  const [title, setTitle] = useState(editing?.title ?? '')
  const [body, setBody] = useState(editing?.body ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(editing?.tags ?? [])
  const [timestamp, setTimestamp] = useState(
    editing?.timestamp
      ? format(new Date(editing.timestamp), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const handleSubmit = () => {
    const entry = { title, body, tags, pinned: editing?.pinned ?? false, timestamp: new Date(timestamp).toISOString() }
    if (editing) updateWorkNote(editing.id, entry)
    else addWorkNote(entry)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Note' : 'New Work Note'}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..."
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your note..."
            rows={5} className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent resize-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</label>
          <div className="mt-1.5 flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add tag, press Enter"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-accent" />
            <button onClick={addTag} className="px-3 py-2 text-sm font-medium text-accent border border-accent rounded-xl active:opacity-70">
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  {t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))} className="ml-0.5 opacity-60">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
          <input type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <button onClick={handleSubmit} disabled={!title.trim()}
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent-color)' }}>
          {editing ? 'Save Changes' : 'Save Note'}
        </button>
      </div>
    </Modal>
  )
}
