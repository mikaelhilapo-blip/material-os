import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchProjects = () => {
    api.get('/projects')
      .then(setProjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await api.post('/projects', { name: name.trim(), description: description.trim() })
      setName('')
      setDescription('')
      setShowForm(false)
      fetchProjects()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.del(`/projects/${id}`)
      fetchProjects()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Projects</h1>
          <p className="mt-1 text-sm text-stone-500">Organize saved materials by project.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Project Name *</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-4">
            {saving ? 'Creating…' : 'Create Project'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500">No projects yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4">+ Create Your First Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <div key={p.id} className="card p-5 transition-shadow hover:shadow-md">
              <Link to={`/projects/${p.id}`}>
                <h3 className="mb-1 font-medium text-stone-900 hover:text-accent">{p.name}</h3>
              </Link>
              {p.description && <p className="mb-3 text-sm text-stone-500">{p.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-400">{p._count?.materials || 0} materials</span>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-stone-400 hover:text-red-500">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
