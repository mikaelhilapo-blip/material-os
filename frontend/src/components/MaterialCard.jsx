import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function MaterialCard({ material, onSave }) {
  const { ids, toggle } = useCompare()
  const { user } = useAuth()
  const isSelected = ids.includes(material.id)

  return (
    <div className="card group overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/material/${material.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-stone-100">
          {material.image ? (
            <img
              src={material.image}
              alt={material.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-400">{material.category}</span>
          {material.source === 'USER_CREATED' && (
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500">Custom</span>
          )}
        </div>
        <Link to={`/material/${material.id}`}>
          <h3 className="mb-1 font-medium text-stone-900 hover:text-accent">{material.name}</h3>
        </Link>
        {material.brand && <p className="mb-2 text-sm text-stone-500">{material.brand}</p>}
        {material.price && <p className="text-sm font-medium text-stone-700">{material.price}</p>}

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => toggle(material.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              isSelected
                ? 'bg-stone-900 text-white'
                : 'border border-stone-300 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {isSelected ? '✓ In Compare' : 'Add to Compare'}
          </button>
          {user && onSave && (
            <button
              onClick={() => onSave(material)}
              className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
