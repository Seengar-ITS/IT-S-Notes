import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Tags() {
  const { user, loading } = useAuth()
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('notebooks').select('*').limit(20)
      .then(({ data: rows }) => { setData(rows ?? []); setFetching(false) })
  }, [user])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-its-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-its-600 flex items-center justify-center font-bold text-xs text-white">IT-S</div>
          <div>
            <h1 className="font-bold text-white text-sm">IT-S-Notes</h1>
            <p className="text-xs text-gray-500">Tags</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-xs text-gray-500">{user.email}</span>}
          <a href="https://it-s-id.vercel.app/dashboard" className="text-xs text-its-400 hover:text-its-500 transition-colors">← IT-S ID</a>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Tags</h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{data.length} records</span>
        </div>

        {fetching ? (
          <div className="grid grid-cols-1 gap-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">No records yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {data.map((row, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">{String(row.id ?? '').slice(0, 8)}…</span>
                  <span className="text-xs text-gray-600">{row.created_at ? new Date(String(row.created_at)).toLocaleDateString() : ''}</span>
                </div>
                <div className="mt-1 text-sm text-gray-300 truncate">
                  {Object.entries(row).filter(([k]) => !['id','created_at'].includes(k)).slice(0,3).map(([k,v]) => `${k}: ${String(v ?? '').slice(0,40)}`).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}