import { StateCreator } from 'zustand'
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings'

export interface SettingsSlice {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (updates) =>
    set((s) => ({ settings: { ...s.settings, ...updates } })),
})
