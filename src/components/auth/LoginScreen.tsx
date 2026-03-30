import { useState, FormEvent } from 'react'
import { supabase } from '../../services/supabase'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
        } else {
          setSuccessMsg('Account created! Check your email to confirm, then sign in.')
          setMode('login')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      {/* Logo / wordmark */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">Slate</h1>
        <p className="text-gray-400 mt-1 text-sm">A clean slate every day</p>
      </div>

      <div className="w-full max-w-sm">
        {/* Tab toggle */}
        <div className="flex rounded-xl bg-gray-800 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-[var(--accent-color)] text-white' : 'text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-[var(--accent-color)] text-white' : 'text-gray-400'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-color)]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-color)]"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {successMsg && (
            <p className="text-green-400 text-sm">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
