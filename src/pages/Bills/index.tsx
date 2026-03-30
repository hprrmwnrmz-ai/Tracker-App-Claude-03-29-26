import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Check, Trash2, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { useStore } from '../../store'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Bill } from '../../types/bill'
import { BILL_CATEGORY_ICONS, BILL_CATEGORY_LABELS } from '../../types/bill'
import { formatCurrency } from '../../utils/formatters'
import { BillFormModal } from './BillForm'

export function BillsPage() {
  const { openDrawer } = useOutletContext<{ openDrawer: () => void }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Bill | undefined>()

  const bills = useStore((s) => s.bills)
  const markBillPaid = useStore((s) => s.markBillPaid)
  const deleteBill = useStore((s) => s.deleteBill)
  const isCurrentPeriodPaid = useStore((s) => s.isCurrentPeriodPaid)
  const getBillsDueThisMonth = useStore((s) => s.getBillsDueThisMonth)
  const getMonthlyTotal = useStore((s) => s.getMonthlyTotal)

  const dueThisMonth = getBillsDueThisMonth()
  const totalMonthly = getMonthlyTotal()
  const paidCount = dueThisMonth.filter((b) => b.paid).length

  return (
    <div className="page-content">
      <PageHeader title="Bills" onMenuClick={openDrawer}
        action={
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-1 text-sm font-semibold text-accent active:opacity-60">
            <Plus size={16} />Add
          </button>
        }
      />

      <div className="px-4 py-4 space-y-5">
        {/* Monthly summary */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center">
            <p className="text-xs text-gray-500">Monthly est.</p>
            <p className="text-base font-bold text-gray-900">{formatCurrency(totalMonthly)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-gray-500">Paid</p>
            <p className="text-base font-bold text-green-600">{paidCount}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-base font-bold text-orange-500">{dueThisMonth.length - paidCount}</p>
          </Card>
        </div>

        {/* Due this month */}
        {dueThisMonth.length > 0 && (
          <div>
            <SectionHeader title={`Due in ${format(new Date(), 'MMMM')}`} />
            <div className="space-y-2">
              {dueThisMonth.map(({ bill, dueDate, paid }) => (
                <Card key={bill.id} padding={false}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="text-2xl">{BILL_CATEGORY_ICONS[bill.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{bill.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(bill.amount)} · Due {format(dueDate, 'MMM d')}
                        {bill.autopay && <span className="ml-1 text-green-600">· Autopay</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => !paid && markBillPaid(bill.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        paid ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}
                    >
                      {paid && <Check size={14} className="text-white" strokeWidth={3} />}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All bills */}
        <div>
          <SectionHeader title="All Bills" />
          {bills.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">📄</p>
              <p className="text-sm">No bills added yet</p>
            </div>
          )}
          <div className="space-y-2">
            {bills.map((bill) => (
              <Card key={bill.id} padding={false}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl">{BILL_CATEGORY_ICONS[bill.category]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{bill.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(bill.amount)} · {bill.frequency} · Due {bill.dueDayOfMonth}{getDaySuffix(bill.dueDayOfMonth)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(bill); setModalOpen(true) }} className="p-1.5 text-gray-400">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteBill(bill.id)} className="p-1.5 text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BillFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  )
}

function getDaySuffix(d: number): string {
  if (d >= 11 && d <= 13) return 'th'
  switch (d % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th' }
}
