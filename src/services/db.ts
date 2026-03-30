import { supabase, getCurrentUserId } from './supabase'
import { ShotEntry } from '../types/shot'
import { WeightEntry } from '../types/weight'
import { FoodEntry } from '../types/food'
import { SymptomEntry } from '../types/symptom'
import { Bill, BillPayment } from '../types/bill'
import { ExerciseEntry } from '../types/exercise'
import { WorkNote } from '../types/work'
import { PhotoEntry } from '../types/photo'
import { AppSettings } from '../types/settings'

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg: string, err?: unknown) {
  if (err) console.error(`[db] ${msg}`, err)
}

// ── Shots ─────────────────────────────────────────────────────────────────────

export const dbShots = {
  async fetchAll(): Promise<ShotEntry[]> {
    const uid = await getCurrentUserId()
    if (!uid) return []
    const { data, error } = await supabase
      .from('shots').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll shots', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp, dose: Number(r.dose),
      site: r.site, notes: r.notes ?? '',
    }))
  },
  async insert(shot: ShotEntry) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('shots').insert({
      id: shot.id, user_id: uid, timestamp: shot.timestamp,
      dose: shot.dose, site: shot.site, notes: shot.notes,
    })
    if (error) log('insert shot', error)
  },
  async update(shot: ShotEntry) {
    const { error } = await supabase.from('shots').update({
      timestamp: shot.timestamp, dose: shot.dose, site: shot.site, notes: shot.notes,
    }).eq('id', shot.id)
    if (error) log('update shot', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('shots').delete().eq('id', id)
    if (error) log('delete shot', error)
  },
}

// ── Weights ───────────────────────────────────────────────────────────────────

export const dbWeights = {
  async fetchAll(): Promise<WeightEntry[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('weights').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll weights', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp,
      weightLbs: Number(r.weight_lbs), notes: r.notes ?? '',
    }))
  },
  async insert(w: WeightEntry) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('weights').insert({
      id: w.id, user_id: uid, timestamp: w.timestamp,
      weight_lbs: w.weightLbs, notes: w.notes,
    })
    if (error) log('insert weight', error)
  },
  async update(w: WeightEntry) {
    const { error } = await supabase.from('weights').update({
      timestamp: w.timestamp, weight_lbs: w.weightLbs, notes: w.notes,
    }).eq('id', w.id)
    if (error) log('update weight', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('weights').delete().eq('id', id)
    if (error) log('delete weight', error)
  },
}

// ── Foods ─────────────────────────────────────────────────────────────────────

export const dbFoods = {
  async fetchAll(): Promise<FoodEntry[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('foods').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll foods', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp, mealType: r.meal_type,
      description: r.description, calories: r.calories ?? 0,
      proteinG: Number(r.protein_g ?? 0), carbsG: Number(r.carbs_g ?? 0),
      fatG: Number(r.fat_g ?? 0), notes: r.notes ?? '',
    }))
  },
  async insert(f: FoodEntry) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('foods').insert({
      id: f.id, user_id: uid, timestamp: f.timestamp, meal_type: f.mealType,
      description: f.description, calories: f.calories, protein_g: f.proteinG,
      carbs_g: f.carbsG, fat_g: f.fatG, notes: f.notes,
    })
    if (error) log('insert food', error)
  },
  async update(f: FoodEntry) {
    const { error } = await supabase.from('foods').update({
      timestamp: f.timestamp, meal_type: f.mealType, description: f.description,
      calories: f.calories, protein_g: f.proteinG, carbs_g: f.carbsG,
      fat_g: f.fatG, notes: f.notes,
    }).eq('id', f.id)
    if (error) log('update food', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('foods').delete().eq('id', id)
    if (error) log('delete food', error)
  },
}

// ── Symptoms ──────────────────────────────────────────────────────────────────

export const dbSymptoms = {
  async fetchAll(): Promise<SymptomEntry[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('symptoms').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll symptoms', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp, symptoms: r.symptoms ?? [],
      severity: r.severity, linkedShotId: r.linked_shot_id ?? undefined, notes: r.notes ?? '',
    }))
  },
  async insert(s: SymptomEntry) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('symptoms').insert({
      id: s.id, user_id: uid, timestamp: s.timestamp, symptoms: s.symptoms,
      severity: s.severity, linked_shot_id: s.linkedShotId ?? null, notes: s.notes,
    })
    if (error) log('insert symptom', error)
  },
  async update(s: SymptomEntry) {
    const { error } = await supabase.from('symptoms').update({
      timestamp: s.timestamp, symptoms: s.symptoms, severity: s.severity,
      linked_shot_id: s.linkedShotId ?? null, notes: s.notes,
    }).eq('id', s.id)
    if (error) log('update symptom', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('symptoms').delete().eq('id', id)
    if (error) log('delete symptom', error)
  },
}

// ── Bills ─────────────────────────────────────────────────────────────────────

export const dbBills = {
  async fetchAll(): Promise<Bill[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('bills').select('*').eq('user_id', uid).order('created_at', { ascending: true })
    if (error) { log('fetchAll bills', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, name: r.name, amount: Number(r.amount), category: r.category,
      frequency: r.frequency, dueDayOfMonth: r.due_day_of_month,
      autopay: r.autopay, notes: r.notes ?? '', isActive: r.is_active,
    }))
  },
  async insert(b: Bill) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('bills').insert({
      id: b.id, user_id: uid, name: b.name, amount: b.amount, category: b.category,
      frequency: b.frequency, due_day_of_month: b.dueDayOfMonth,
      autopay: b.autopay, notes: b.notes, is_active: b.isActive,
    })
    if (error) log('insert bill', error)
  },
  async update(id: string, updates: Partial<Bill>) {
    const { error } = await supabase.from('bills').update({
      name: updates.name, amount: updates.amount, category: updates.category,
      frequency: updates.frequency, due_day_of_month: updates.dueDayOfMonth,
      autopay: updates.autopay, notes: updates.notes, is_active: updates.isActive,
    }).eq('id', id)
    if (error) log('update bill', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('bills').delete().eq('id', id)
    if (error) log('delete bill', error)
  },
}

export const dbBillPayments = {
  async fetchAll(): Promise<BillPayment[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('bill_payments').select('*').eq('user_id', uid)
    if (error) { log('fetchAll bill_payments', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, billId: r.bill_id, paidDate: r.paid_date,
      amount: Number(r.amount), periodLabel: r.period_label, notes: r.notes ?? '',
    }))
  },
  async insert(p: BillPayment) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('bill_payments').insert({
      id: p.id, user_id: uid, bill_id: p.billId, paid_date: p.paidDate,
      amount: p.amount, period_label: p.periodLabel, notes: p.notes,
    })
    if (error) log('insert bill_payment', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('bill_payments').delete().eq('id', id)
    if (error) log('delete bill_payment', error)
  },
}

// ── Exercises ─────────────────────────────────────────────────────────────────

export const dbExercises = {
  async fetchAll(): Promise<ExerciseEntry[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('exercises').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll exercises', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp, type: r.type,
      durationMinutes: r.duration_minutes, intensity: r.intensity,
      caloriesBurned: r.calories_burned ?? undefined, notes: r.notes ?? '',
    }))
  },
  async insert(e: ExerciseEntry) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('exercises').insert({
      id: e.id, user_id: uid, timestamp: e.timestamp, type: e.type,
      duration_minutes: e.durationMinutes, intensity: e.intensity,
      calories_burned: e.caloriesBurned ?? null, notes: e.notes,
    })
    if (error) log('insert exercise', error)
  },
  async update(id: string, updates: Partial<ExerciseEntry>) {
    const { error } = await supabase.from('exercises').update({
      timestamp: updates.timestamp, type: updates.type,
      duration_minutes: updates.durationMinutes, intensity: updates.intensity,
      calories_burned: updates.caloriesBurned ?? null, notes: updates.notes,
    }).eq('id', id)
    if (error) log('update exercise', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('exercises').delete().eq('id', id)
    if (error) log('delete exercise', error)
  },
}

// ── Work Notes ────────────────────────────────────────────────────────────────

export const dbWorkNotes = {
  async fetchAll(): Promise<WorkNote[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('work_notes').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll work_notes', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp, title: r.title,
      body: r.body ?? '', tags: r.tags ?? [], pinned: r.pinned,
    }))
  },
  async insert(n: WorkNote) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('work_notes').insert({
      id: n.id, user_id: uid, timestamp: n.timestamp,
      title: n.title, body: n.body, tags: n.tags, pinned: n.pinned,
    })
    if (error) log('insert work_note', error)
  },
  async update(id: string, updates: Partial<WorkNote>) {
    const { error } = await supabase.from('work_notes').update({
      timestamp: updates.timestamp, title: updates.title, body: updates.body,
      tags: updates.tags, pinned: updates.pinned,
    }).eq('id', id)
    if (error) log('update work_note', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('work_notes').delete().eq('id', id)
    if (error) log('delete work_note', error)
  },
}

// ── Photos ────────────────────────────────────────────────────────────────────

export const dbPhotos = {
  async fetchAll(): Promise<PhotoEntry[]> {
    const uid = await getCurrentUserId(); if (!uid) return []
    const { data, error } = await supabase
      .from('photos').select('*').eq('user_id', uid).order('timestamp', { ascending: false })
    if (error) { log('fetchAll photos', error); return [] }
    return (data ?? []).map(r => ({
      id: r.id, timestamp: r.timestamp, caption: r.caption ?? '',
      weightAtTime: r.weight_at_time ?? undefined, blobKey: r.storage_path,
    }))
  },
  async insert(p: PhotoEntry) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('photos').insert({
      id: p.id, user_id: uid, timestamp: p.timestamp, caption: p.caption,
      weight_at_time: p.weightAtTime ?? null, storage_path: p.blobKey,
    })
    if (error) log('insert photo', error)
  },
  async delete(id: string) {
    const { error } = await supabase.from('photos').delete().eq('id', id)
    if (error) log('delete photo', error)
  },
  async uploadBlob(userId: string, photoId: string, blob: Blob): Promise<string> {
    const ext = blob.type.includes('png') ? 'png' : 'jpg'
    const path = `${userId}/${photoId}.${ext}`
    const { error } = await supabase.storage.from('photos').upload(path, blob, { upsert: true })
    if (error) log('upload photo blob', error)
    return path
  },
  async getSignedUrl(path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('photos').createSignedUrl(path, 3600)
    if (error) { log('signed url', error); return null }
    return data?.signedUrl ?? null
  },
  async deleteBlob(path: string) {
    const { error } = await supabase.storage.from('photos').remove([path])
    if (error) log('delete photo blob', error)
  },
}

// ── Settings ──────────────────────────────────────────────────────────────────

export const dbSettings = {
  async fetch(): Promise<Partial<AppSettings>> {
    const uid = await getCurrentUserId(); if (!uid) return {}
    const { data, error } = await supabase
      .from('settings').select('*').eq('user_id', uid).single()
    if (error || !data) return {}
    return {
      weightUnit: data.weight_unit,
      accentColor: data.accent_color,
      reminderEnabled: data.reminder_enabled,
      reminderDayOfWeek: data.reminder_day_of_week,
      reminderHour: data.reminder_hour,
      reminderMinute: data.reminder_minute,
      currentDose: Number(data.current_dose),
      startDate: data.start_date,
      goalWeightLbs: Number(data.goal_weight_lbs ?? 0),
      heightInches: data.height_inches ? Number(data.height_inches) : undefined,
    }
  },
  async upsert(s: AppSettings) {
    const uid = await getCurrentUserId(); if (!uid) return
    const { error } = await supabase.from('settings').upsert({
      user_id: uid, weight_unit: s.weightUnit, accent_color: s.accentColor,
      reminder_enabled: s.reminderEnabled, reminder_day_of_week: s.reminderDayOfWeek,
      reminder_hour: s.reminderHour, reminder_minute: s.reminderMinute,
      current_dose: s.currentDose, start_date: s.startDate,
      goal_weight_lbs: s.goalWeightLbs, height_inches: s.heightInches ?? null,
      updated_at: new Date().toISOString(),
    })
    if (error) log('upsert settings', error)
  },
}
