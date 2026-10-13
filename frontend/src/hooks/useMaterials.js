import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client.js'

export function useMaterials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const fetchMaterials = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category && category !== 'All') params.set('category', category)
      const data = await api.get(`/materials?${params}`)
      setMaterials(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    const timer = setTimeout(fetchMaterials, 200)
    return () => clearTimeout(timer)
  }, [fetchMaterials])

  return { materials, loading, error, search, setSearch, category, setCategory, refetch: fetchMaterials }
}
