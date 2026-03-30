import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useStore } from './store'
import { useAuth } from './contexts/AuthContext'
import { BottomNav } from './components/layout/BottomNav'
import { DrawerMenu } from './components/layout/DrawerMenu'
import { LoginScreen } from './components/auth/LoginScreen'

// Pages
import { SummaryPage } from './pages/Summary'
import { ShotsPage } from './pages/Shots'
import { ResultsPage } from './pages/Results'
import { CalendarPage } from './pages/Calendar'
import { SettingsPage } from './pages/Settings'
import { FoodPage } from './pages/FoodLog'
import { PhotosPage } from './pages/Photos'
import { SymptomsPage } from './pages/Symptoms'
import { BillsPage } from './pages/Bills'
import { ExercisePage } from './pages/Exercise'
import { WorkPage } from './pages/Work'

function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Outlet context={{ openDrawer: () => setDrawerOpen(true) }} />
      <BottomNav />
    </>
  )
}

function AppRoutes() {
  const settings = useStore((s) => s.settings)
  const loadAll = useStore((s) => s.loadAll)
  const { user } = useAuth()
  const [dataLoaded, setDataLoaded] = useState(false)

  // Inject accent color CSS variable whenever settings change
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent-color', settings.accentColor)
    root.style.setProperty('--accent-light', settings.accentColor + '20')
    root.style.setProperty('--accent-dark', settings.accentColor)
  }, [settings.accentColor])

  // Load all data from Supabase when user logs in
  useEffect(() => {
    if (user) {
      setDataLoaded(false)
      loadAll().then(() => setDataLoaded(true))
    } else {
      setDataLoaded(false)
    }
  }, [user?.id])

  if (!user) return <LoginScreen />

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: 'var(--accent-color)', borderTopColor: 'transparent' }}
          />
          <p className="text-gray-400 text-sm">Loading your data…</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/summary" replace />} />
        <Route path="/summary"  element={<SummaryPage />} />
        <Route path="/shots"    element={<ShotsPage />} />
        <Route path="/results"  element={<ResultsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/food"     element={<FoodPage />} />
        <Route path="/photos"   element={<PhotosPage />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/bills"    element={<BillsPage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        <Route path="/work"     element={<WorkPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
