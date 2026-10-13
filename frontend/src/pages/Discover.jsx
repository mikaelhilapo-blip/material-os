import { useState } from 'react'
import { useMaterials } from '../hooks/useMaterials.js'
import MaterialCard from '../components/MaterialCard.jsx'
import SaveToProjectModal from '../components/SaveToProjectModal.jsx'

const CATEGORIES = ['All', 'Tiles', 'Flooring', 'Paint', 'Wood', 'Stone', 'Laminates']

export default function Discover() {
  const { materials, loading, error, search, setSearch, category, setCategory } = useMaterials()
  const [saveTarget, setSaveTarget] = useState(null)

  return (
    <div>
      {/* Hero */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Discover Materials
          </h1>
          <p className="mt-2 text-stone-500">
            Browse a curated catalogue of architectural materials. Compare products, save favourites, and organize by project.
          </p>

          {/* Search */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search by name, brand, or supplier…"
              className="input max-w-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`chip ${category === cat ? 'chip-active' : 'chip-inactive'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="aspect-[4/3] bg-stone-200" />
                <div className="p-4">
                  <div className="mb-2 h-3 w-20 rounded bg-stone-200" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-stone-200" />
                  <div className="h-3 w-1/2 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : materials.length === 0 ? (
          <p className="py-12 text-center text-stone-500">No materials found. Try a different search or filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {materials.map(m => (
              <MaterialCard key={m.id} material={m} onSave={setSaveTarget} />
            ))}
          </div>
        )}
      </div>

      {saveTarget && (
        <SaveToProjectModal
          material={saveTarget}
          onClose={() => setSaveTarget(null)}
        />
      )}
    </div>
  )
}
