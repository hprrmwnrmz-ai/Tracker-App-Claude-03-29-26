export type AccentColor = '#2B9FD9' | '#7c3aed' | '#16a34a' | '#e11d48' | '#ea580c';

export const ACCENT_COLOR_OPTIONS: { label: string; value: AccentColor }[] = [
  { label: 'Blue', value: '#2B9FD9' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Orange', value: '#ea580c' },
];

export interface AppSettings {
  weightUnit: 'lbs' | 'kg';
  accentColor: string;
  reminderEnabled: boolean;
  reminderDayOfWeek: number; // 0=Sun, 6=Sat
  reminderHour: number;
  reminderMinute: number;
  currentDose: number;
  startDate: string;
  goalWeightLbs: number;
  heightInches?: number; // for BMI calculation
}

export const DEFAULT_SETTINGS: AppSettings = {
  weightUnit: 'lbs',
  accentColor: '#2B9FD9',
  reminderEnabled: false,
  reminderDayOfWeek: 0,
  reminderHour: 9,
  reminderMinute: 0,
  currentDose: 5,
  startDate: '2025-12-31',
  goalWeightLbs: 0,
};
