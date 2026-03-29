import { StateCreator } from 'zustand'
import { Bill, BillPayment } from '../types/bill'
import { format, getDaysInMonth, setDate } from 'date-fns'

export interface BillSlice {
  bills: Bill[]
  billPayments: BillPayment[]
  addBill: (bill: Omit<Bill, 'id'>) => void
  updateBill: (id: string, updates: Partial<Bill>) => void
  deleteBill: (id: string) => void
  markBillPaid: (billId: string, amount?: number) => void
  unmarkBillPaid: (paymentId: string) => void
  isCurrentPeriodPaid: (billId: string) => boolean
  getBillsDueThisMonth: () => { bill: Bill; dueDate: Date; paid: boolean }[]
  getMonthlyTotal: () => number
}

export const createBillSlice: StateCreator<BillSlice> = (set, get) => ({
  bills: [],
  billPayments: [],

  addBill: (bill) =>
    set((s) => ({ bills: [...s.bills, { ...bill, id: crypto.randomUUID() }] })),

  updateBill: (id, updates) =>
    set((s) => ({ bills: s.bills.map((b) => (b.id === id ? { ...b, ...updates } : b)) })),

  deleteBill: (id) =>
    set((s) => ({
      bills: s.bills.filter((b) => b.id !== id),
      billPayments: s.billPayments.filter((p) => p.billId !== id),
    })),

  markBillPaid: (billId, amount) => {
    const bill = get().bills.find((b) => b.id === billId)
    if (!bill) return
    const now = new Date()
    const payment: BillPayment = {
      id: crypto.randomUUID(),
      billId,
      paidDate: now.toISOString(),
      amount: amount ?? bill.amount,
      periodLabel: format(now, 'MMMM yyyy'),
      notes: '',
    }
    set((s) => ({ billPayments: [...s.billPayments, payment] }))
  },

  unmarkBillPaid: (paymentId) =>
    set((s) => ({ billPayments: s.billPayments.filter((p) => p.id !== paymentId) })),

  isCurrentPeriodPaid: (billId) => {
    const currentPeriod = format(new Date(), 'MMMM yyyy')
    return get().billPayments.some(
      (p) => p.billId === billId && p.periodLabel === currentPeriod
    )
  },

  getBillsDueThisMonth: () => {
    const now = new Date()
    const daysInMonth = getDaysInMonth(now)
    return get()
      .bills.filter((b) => b.isActive && b.frequency !== 'one-time')
      .map((bill) => {
        const day = Math.min(bill.dueDayOfMonth, daysInMonth)
        const dueDate = setDate(now, day)
        const paid = get().isCurrentPeriodPaid(bill.id)
        return { bill, dueDate, paid }
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  },

  getMonthlyTotal: () =>
    get()
      .bills.filter((b) => b.isActive)
      .reduce((sum, b) => {
        if (b.frequency === 'monthly') return sum + b.amount
        if (b.frequency === 'annual') return sum + b.amount / 12
        if (b.frequency === 'quarterly') return sum + b.amount / 3
        if (b.frequency === 'weekly') return sum + b.amount * 4.33
        return sum
      }, 0),
})
