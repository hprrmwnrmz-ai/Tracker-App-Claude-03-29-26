import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2, Pencil, Search, Pin } from 'lucide-react'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { WorkNote } from '../../types/work'
import { formatDate } from '../../utils/formatters'
import { WorkNoteFormModal } from './WorkNoteForm'

export function WorkPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<WorkNote | undefined>()
  const [viewingNote, setViewingNote] = useState<WorkNote | undefined>()
  const [query, setQuery] = useState('')

  const workNotes = useStore((s) => s.workNotes)
  const deleteWorkNote = useStore((s) => s.deleteWorkNote)
  const updateWorkNote = useStore((s) => s.updateWorkNote)
  const searchWorkNotes = useStore((s) => s.searchWorkNotes)

  const displayed = query.trim() ? searchWorkNotes(query) : workNotes
  const pinned = displayed.filter((n) => n.pinned)
  const unpinned = displayed.filter((n) => !n.pinned)

  return (
    <div className="page-content">
      <PageHeader title="Work Notes" onMenuClick={openDrawer}
        action={
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Add
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes or tags..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent shadow-sm" />
        </div>

        {workNotes.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💼</p>
            <p className="font-medium">No work notes yet</p>
            <p className="text-sm mt-1">Tap + Add to create your first note</p>
          </div>
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Pinned</p>
            <div className="space-y-2">
              {pinned.map((note) => <NoteCard key={note.id} note={note}
                onView={() => setViewingNote(note)}
                onEdit={() => { setEditing(note); setModalOpen(true) }}
                onDelete={() => deleteWorkNote(note.id)}
                onTogglePin={() => updateWorkNote(note.id, { pinned: !note.pinned })} />)}
            </div>
          </div>
        )}

        {/* All notes */}
        {unpinned.length > 0 && (
          <div>
            {pinned.length > 0 && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes</p>}
            <div className="space-y-2">
              {unpinned.map((note) => <NoteCard key={note.id} note={note}
                onView={() => setViewingNote(note)}
                onEdit={() => { setEditing(note); setModalOpen(true) }}
                onDelete={() => deleteWorkNote(note.id)}
                onTogglePin={() => updateWorkNote(note.id, { pinned: !note.pinned })} />)}
            </div>
          </div>
        )}
      </div>

      <WorkNoteFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />

      {/* View full note modal */}
      {viewingNote && (
        <Modal open onClose={() => setViewingNote(undefined)} title={viewingNote.title}>
          <div className="space-y-3">
            {viewingNote.body && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingNote.body}</p>
            )}
            {viewingNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {viewingNote.tags.map((t) => (
                  <span key={t} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{t}</span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400">{formatDate(viewingNote.timestamp)}</p>
          </div>
        </Modal>
      )}
    </div>
  )
}

function NoteCard({ note, onView, onEdit, onDelete, onTogglePin }: {
  note: WorkNote; onView: () => void; onEdit: () => void; onDelete: () => void; onTogglePin: () => void
}) {
  return (
    <Card padding={false}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <button type="button" className="flex-1 min-w-0 text-left active:opacity-70" onClick={onView}>
            <p className="font-semibold text-gray-900 text-sm">{note.title}</p>
            {note.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.body}</p>}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400">{formatDate(note.timestamp)}</span>
              {note.tags.map((t) => (
                <span key={t} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{t}</span>
              ))}
            </div>
          </button>
          <div className="flex gap-1 flex-shrink-0">
            <button type="button" onClick={onTogglePin} className={`p-1.5 ${note.pinned ? 'text-yellow-500' : 'text-gray-300'}`}>
              <Pin size={14} />
            </button>
            <button type="button" onClick={onEdit} className="p-1.5 text-gray-400"><Pencil size={14} /></button>
            <button type="button" onClick={onDelete} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
          </div>
        </div>
      </div>
    </Card>
  )
}
