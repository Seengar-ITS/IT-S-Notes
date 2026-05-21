import { useEffect, useState } from 'react'
const ITS_ID = import.meta.env.VITE_ITS_ID_URL || 'https://its-id1.vercel.app'
interface AuthUser { id: string; email: string; name: string; avatar: string }
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Check URL for its_token (from IT-S-ID1 SSO redirect)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('its_token')
    if (urlToken) {
      localStorage.setItem('its-id-token', urlToken)
      const url = new URL(window.location.href)
      url.searchParams.delete('its_token')
      window.history.replaceState({}, '', url.toString())
    }
    const token = localStorage.getItem('its-id-token')
    if (!token) { setLoading(false); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp ? payload.exp * 1000 : Infinity
      if (Date.now() > exp) { localStorage.removeItem('its-id-token'); setLoading(false); return }
      setUser({
        id: payload.sub || payload.id || '',
        email: payload.email || '',
        name: payload.name || payload.email || 'User',
        avatar: payload.avatar || ''
      })
    } catch {
      localStorage.removeItem('its-id-token')
    }
    setLoading(false)
  }, [])
  function signOut() { localStorage.removeItem('its-id-token'); setUser(null) }
  function loginWithITS() { window.location.href = `${ITS_ID}/login?redirect=${encodeURIComponent(window.location.href)}` }
  return { user, loading, signOut, loginWithITS }
}
