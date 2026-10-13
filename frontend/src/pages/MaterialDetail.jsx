import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { useCompare } from '../context/CompareContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import SaveToProjectModal from '../components/SaveToProjectModal.jsx'

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

export default function MaterialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ids, toggle } = useCompare()
  const { user } = useAuth()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSave, setShowSave] = useState(false)

  useEffect(() => {
    api.get(`/materials/${id}`)
      .then(setMaterial)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-12 text-stone-500">Loading…</div>
  if (error) return <div className="mx-auto max-w-4xl px-4 py-12 text-red-600">{error}</div>
  if (!material) return null

  const isSelected = ids.includes(material.id)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm text-stone-500 hover:text-stone-900">
        ← Back
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="aspect-[4/3] bg-stone-100">
            {material.image && (
              <img src={material.image} alt={material.name} className="h-full w-full object-cover" />
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-400">{material.category}</span>
            {material.source === 'SUPPLIER_LISTING' && (
              <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500">Sample Data</span>
            )}
            {material.source === 'USER_CREATED' && (
              <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500">Custom Material</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-stone-900">{material.name}</h1>
          {material.brand && <p className="mt-1 text-stone-500">{material.brand}</p>}
          {material.price && <p className="mt-3 text-lg font-medium text-stone-800">{material.price}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => toggle(material.id)}
              className={isSelected ? 'btn-primary' : 'btn-outline'}
            >
              {isSelected ? '✓ In Compare' : 'Add to Compare'}
            </button>
            {user && (
              <button onClick={() => setShowSave(true)} className="btn-outline">
                Save to Project
              </button>
            )}
            {!user && (
              <Link to="/login" className="btn-ghost">Sign in to save</Link>
            )}
          </div>

          {material.notes && (
            <div className="mt-6 rounded-lg bg-stone-50 p-4">
              <p className="text-sm text-stone-600">{material.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Spec Table */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-stone-900">Specifications</h2>
        <div className="card overflow-hidden">
          <table className="w-full">
            <tbody>
              {FIELDS.map((field, i) => (
                <tr key={field.key} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="w-1/3 px-4 py-3 text-sm font-medium text-stone-600">{field.label}</td>
                  <td className="px-4 py-3 text-sm text-stone-900">
                    {material[field.key] || <span className="text-stone-400 italic">Not provided</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSave && (
        <SaveToProjectModal material={material} onClose={() => setShowSave(false)} />
      )}
    </div>
  )
}
