export type ExerciseType =
  | 'walk'
  | 'run'
  | 'bike'
  | 'swim'
  | 'gym'
  | 'yoga'
  | 'pilates'
  | 'hike'
  | 'sports'
  | 'other';

export type Intensity = 'light' | 'moderate' | 'hard';

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  walk: 'Walk',
  run: 'Run',
  bike: 'Bike',
  swim: 'Swim',
  gym: 'Gym',
  yoga: 'Yoga',
  pilates: 'Pilates',
  hike: 'Hike',
  sports: 'Sports',
  other: 'Other',
};

export const EXERCISE_TYPE_ICONS: Record<ExerciseType, string> = {
  walk: '🚶',
  run: '🏃',
  bike: '🚴',
  swim: '🏊',
  gym: '🏋️',
  yoga: '🧘',
  pilates: '🤸',
  hike: '🥾',
  sports: '⚽',
  other: '💪',
};

export interface ExerciseEntry {
  id: string;
  timestamp: string; // ISO 8601
  type: ExerciseType;
  durationMinutes: number;
  intensity: Intensity;
  caloriesBurned?: number;
  notes: string;
}
