import { StateCreator } from 'zustand'
import { ShotEntry, InjectionSite, INJECTION_SITE_ROTATION } from '../types/shot'
import { dbShots } from '../services/db'

// Seed data from user's Zepbound history (imported on first login)
export const SEED_SHOTS: ShotEntry[] = [
  { id: '00000000-0000-0000-0000-000000000001', timestamp: '2025-12-31T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-left',  notes: '' },
  { id: '00000000-0000-0000-0000-000000000002', timestamp: '2026-01-07T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-right', notes: '' },
  { id: '00000000-0000-0000-0000-000000000003', timestamp: '2026-01-13T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-left',  notes: '' },
  { id: '00000000-0000-0000-0000-000000000004', timestamp: '2026-01-20T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-right', notes: '' },
  { id: '00000000-0000-0000-0000-000000000005', timestamp: '2026-01-27T10:00:00.000Z', dose: 3.25, site: 'thigh-left',          notes: '' },
  { id: '00000000-0000-0000-0000-000000000006', timestamp: '2026-02-03T10:00:00.000Z', dose: 3.25, site: 'thigh-right',         notes: '' },
  { id: '00000000-0000-0000-0000-000000000007', timestamp: '2026-02-10T10:00:00.000Z', dose: 3.25, site: 'upper-arm-left',      notes: '' },
  { id: '00000000-0000-0000-0000-000000000008', timestamp: '2026-02-17T10:00:00.000Z', dose: 3.25, site: 'upper-arm-right',     notes: '' },
  { id: '00000000-0000-0000-0000-000000000009', timestamp: '2026-02-24T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-left',  notes: '' },
  { id: '00000000-0000-0000-0000-000000000010', timestamp: '2026-03-03T10:00:00.000Z', dose: 3.25, site: 'abdomen-lower-right', notes: '' },
  { id: '00000000-0000-0000-0000-000000000011', timestamp: '2026-03-10T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-left',  notes: '' },
  { id: '00000000-0000-0000-0000-000000000012', timestamp: '2026-03-17T10:00:00.000Z', dose: 3.25, site: 'abdomen-upper-right', notes: '' },
  { id: '00000000-0000-0000-0000-000000000013', timestamp: '2026-03-23T10:00:00.000Z', dose: 5,    site: 'thigh-left',          notes: 'Dose increased to 5mg' },
  { id: '00000000-0000-0000-0000-000000000014', timestamp: '2026-03-29T10:00:00.000Z', dose: 5,    site: 'thigh-right',         notes: '' },
]

export interface ShotSlice {
  shots: ShotEntry[]
  addShot: (shot: Omit<ShotEntry, 'id'>) => void
  updateShot: (id: string, updates: Partial<ShotEntry>) => void
  deleteShot: (id: string) => void
  getNextSite: () => InjectionSite
  getLastShot: () => ShotEntry | undefined
  getDaysSinceLastShot: () => number
  getDaysUntilNextShot: () => number
}

export const createShotSlice: StateCreator<ShotSlice> = (set, get) => ({
  shots: [],

  addShot: (shot) => {
    const newShot: ShotEntry = { ...shot, id: crypto.randomUUID() }
    set((s) => ({
      shots: [newShot, ...s.shots].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }))
    dbShots.insert(newShot)
  },

  updateShot: (id, updates) => {
    set((s) => ({
      shots: s.shots.map((sh) => (sh.id === id ? { ...sh, ...updates } : sh)),
    }))
    const updated = get().shots.find((sh) => sh.id === id)
    if (updated) dbShots.update(updated)
  },

  deleteShot: (id) => {
    set((s) => ({ shots: s.shots.filter((sh) => sh.id !== id) }))
    dbShots.delete(id)
  },

  getNextSite: () => {
    const { shots } = get()
    if (shots.length === 0) return INJECTION_SITE_ROTATION[0]
    const lastSite = shots[0].site
    const lastIdx = INJECTION_SITE_ROTATION.indexOf(lastSite)
    return INJECTION_SITE_ROTATION[(lastIdx + 1) % INJECTION_SITE_ROTATION.length]
  },

  getLastShot: () => get().shots[0],

  getDaysSinceLastShot: () => {
    const { shots } = get()
    if (shots.length === 0) return Infinity
    const last = new Date(shots[0].timestamp)
    return Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24))
  },

  getDaysUntilNextShot: () => 7 - get().getDaysSinceLastShot(),
})
