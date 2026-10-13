import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { useCompare } from '../context/CompareContext.jsx'

const FIELDS = [
  { key: 'price', label: 'Price' },
  { key: 'sizes', label: 'Available Sizes' },
  { key: 'finish', label: 'Appearance / Finish' },
  { key: 'composition', label: 'Material / Composition' },
  { key: 'durability', label: 'Durability' },
  { key: 'performance', label: 'Performance' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'availability', label: 'Availability' },
  { key: 'warranty', label: 'Warranty' },
  { key: 'supplier', label: 'Supplier' },
]

export default function Compare() {
  const { ids, remove, clear } = useCompare()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) { setMaterials([]); setLoading(false); return }
    Promise.all(ids.map(id => api.get(`/materials/${id}`)))
      .then(setMaterials)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ids])

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-12 text-stone-500">Loading…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Compare Materials</h1>
          <p className="mt-1 text-sm text-stone-500">Compare up to 3 products side by side.</p>
        </div>
        {ids.length > 0 && (
          <button onClick={clear} className="btn-ghost text-sm">Clear all</button>
        )}
      </div>

      {materials.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500">No materials selected for comparison.</p>
          <Link to="/" className="btn-primary mt-4">Browse Materials</Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="w-40 px-4 py-4 text-left text-sm font-medium text-stone-400">Product</th>
                {materials.map(m => (
                  <th key={m.id} className="px-4 py-4 text-left align-top">
                    <div className="flex flex-col gap-2">
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-100">
                        {m.image && <img src={m.image} alt={m.name} className="h-full w-full object-cover" />}
                      </div>
                      <Link to={`/material/${m.id}`} className="font-medium text-stone-900 hover:text-accent">
                        {m.name}
                      </Link>
                      <p className="text-xs text-stone-500">{m.brand || '—'}</p>
                      <button
                        onClick={() => remove(m.id)}
                        className="text-xs text-stone-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map((field, i) => (
                <tr key={field.key} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="px-4 py-3.5 text-sm font-medium text-stone-600">{field.label}</td>
                  {materials.map(m => (
                    <td key={m.id} className="px-4 py-3.5 text-sm text-stone-900">
                      {m[field.key] || <span className="italic text-stone-400">Not provided</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
