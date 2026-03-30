export type Severity = 1 | 2 | 3 | 4 | 5;

export const COMMON_SYMPTOMS = [
  'Nausea',
  'Fatigue',
  'Constipation',
  'Diarrhea',
  'Headache',
  'Vomiting',
  'Heartburn',
  'Injection site reaction',
  'Appetite change',
  'Dizziness',
  'Other',
];

export interface SymptomEntry {
  id: string;
  timestamp: string; // ISO 8601
  symptoms: string[];
  severity: Severity;
  linkedShotId?: string;
  notes: string;
}
