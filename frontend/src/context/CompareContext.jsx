import { createContext, useContext, useEffect, useState } from 'react'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('compareIds') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('compareIds', JSON.stringify(ids))
  }, [ids])

  const toggle = (id) => {
    setIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const remove = (id) => setIds(prev => prev.filter(i => i !== id))
  const clear = () => setIds([])

  return (
    <CompareContext.Provider value={{ ids, toggle, remove, clear }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  return useContext(CompareContext)
}
