import { useState } from 'react'
import { useStore } from '../../store'
import { Modal } from '../../components/ui/Modal'
import { Bill, BillCategory, BillFrequency, BILL_CATEGORY_LABELS, BILL_CATEGORY_ICONS } from '../../types/bill'

interface BillFormModalProps {
  open: boolean
  onClose: () => void
  editing?: Bill
}

const CATEGORIES = Object.entries(BILL_CATEGORY_LABELS) as [BillCategory, string][]
const FREQUENCIES: { value: BillFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
  { value: 'one-time', label: 'One-time' },
]

export function BillFormModal({ open, onClose, editing }: BillFormModalProps) {
  const addBill = useStore((s) => s.addBill)
  const updateBill = useStore((s) => s.updateBill)

  const [name, setName] = useState(editing?.name ?? '')
  const [amount, setAmount] = useState(String(editing?.amount ?? ''))
  const [category, setCategory] = useState<BillCategory>(editing?.category ?? 'other')
  const [frequency, setFrequency] = useState<BillFrequency>(editing?.frequency ?? 'monthly')
  const [dueDay, setDueDay] = useState(String(editing?.dueDayOfMonth ?? '1'))
  const [autopay, setAutopay] = useState(editing?.autopay ?? false)
  const [notes, setNotes] = useState(editing?.notes ?? '')

  const handleSubmit = () => {
    const entry = { name, amount: parseFloat(amount) || 0, category, frequency,
      dueDayOfMonth: parseInt(dueDay) || 1, autopay, notes, isActive: true }
    if (editing) updateBill(editing.id, entry)
    else addBill(entry)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Bill' : 'Add Bill'}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Netflix, Rent"
            className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Day</label>
            <input type="number" value={dueDay} onChange={(e) => setDueDay(e.target.value)} min="1" max="31"
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
          <div className="mt-1.5 grid grid-cols-4 gap-1.5">
            {CATEGORIES.map(([val, label]) => (
              <button key={val} onClick={() => setCategory(val)}
                className={`flex flex-col items-center py-2 rounded-xl border text-xs transition-colors ${
                  category === val ? 'border-accent text-accent bg-accent/10' : 'border-gray-200 text-gray-600'
                }`}>
                <span className="text-base">{BILL_CATEGORY_ICONS[val]}</span>
                <span className="mt-0.5 text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Frequency</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {FREQUENCIES.map(({ value, label }) => (
              <button key={value} onClick={() => setFrequency(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  frequency === value ? 'border-accent text-accent bg-accent/10' : 'border-gray-200 text-gray-600'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setAutopay(!autopay)}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${autopay ? 'bg-accent' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${autopay ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">Autopay</span>
        </label>

        <button onClick={handleSubmit}
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm active:opacity-80"
          style={{ backgroundColor: 'var(--accent-color)' }}>
          {editing ? 'Save Changes' : 'Add Bill'}
        </button>
      </div>
    </Modal>
  )
}
