export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  timestamp: string; // ISO 8601
  mealType: MealType;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes: string;
}
