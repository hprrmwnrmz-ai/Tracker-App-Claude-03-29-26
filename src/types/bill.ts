export type BillFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'one-time';

export type BillCategory =
  | 'housing'
  | 'utilities'
  | 'subscriptions'
  | 'insurance'
  | 'medical'
  | 'transportation'
  | 'food'
  | 'other';

export const BILL_CATEGORY_LABELS: Record<BillCategory, string> = {
  housing: 'Housing',
  utilities: 'Utilities',
  subscriptions: 'Subscriptions',
  insurance: 'Insurance',
  medical: 'Medical',
  transportation: 'Transportation',
  food: 'Food',
  other: 'Other',
};

export const BILL_CATEGORY_ICONS: Record<BillCategory, string> = {
  housing: '🏠',
  utilities: '💡',
  subscriptions: '📱',
  insurance: '🛡️',
  medical: '💊',
  transportation: '🚗',
  food: '🛒',
  other: '📄',
};

export interface Bill {
  id: string;
  name: string;
  amount: number;
  category: BillCategory;
  frequency: BillFrequency;
  dueDayOfMonth: number; // 1-31
  autopay: boolean;
  notes: string;
  isActive: boolean;
}

export interface BillPayment {
  id: string;
  billId: string;
  paidDate: string; // ISO 8601
  amount: number;
  periodLabel: string; // e.g. "March 2026"
  notes: string;
}
