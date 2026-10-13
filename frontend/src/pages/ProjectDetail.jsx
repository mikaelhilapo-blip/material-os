import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { useCompare } from '../context/CompareContext.jsx'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ids, toggle } = useCompare()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProject = () => {
    api.get(`/projects/${id}`)
      .then(setProject)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProject() }, [id])

  const handleRemove = async (materialId) => {
    try {
      await api.del(`/projects/${id}/materials/${materialId}`)
      fetchProject()
    } catch (e) {
      alert(e.message)
    }
  }

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-12 text-stone-500">Loading…</div>
  if (error) return <div className="mx-auto max-w-5xl px-4 py-12 text-red-600">{error}</div>
  if (!project) return null

  const materials = project.materials.map(pm => pm.material)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/projects')} className="mb-6 text-sm text-stone-500 hover:text-stone-900">
        ← All Projects
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">{project.name}</h1>
        {project.description && <p className="mt-1 text-stone-500">{project.description}</p>}
        <p className="mt-2 text-sm text-stone-400">{materials.length} materials</p>
      </div>

      {materials.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500">No materials saved to this project yet.</p>
          <Link to="/" className="btn-primary mt-4">Browse Materials</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map(m => {
            const isSelected = ids.includes(m.id)
            return (
              <div key={m.id} className="card overflow-hidden">
                <Link to={`/material/${m.id}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                    {m.image && <img src={m.image} alt={m.name} className="h-full w-full object-cover" />}
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-stone-400">{m.category}</span>
                  <Link to={`/material/${m.id}`}>
                    <h3 className="mb-1 font-medium text-stone-900 hover:text-accent">{m.name}</h3>
                  </Link>
                  {m.brand && <p className="mb-2 text-sm text-stone-500">{m.brand}</p>}
                  {m.price && <p className="text-sm font-medium text-stone-700">{m.price}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => toggle(m.id)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${
                        isSelected ? 'bg-stone-900 text-white' : 'border border-stone-300 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {isSelected ? '✓ In Compare' : 'Add to Compare'}
                    </button>
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
