import { useState, useEffect } from 'react'
import { api } from '../api/client.js'

export default function SaveToProjectModal({ material, onClose, onSaved }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    api.get('/projects')
      .then(setProjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/materials`, { materialId: material.id })
      onSaved?.()
      onClose()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      const project = await api.post('/projects', { name: newName.trim() })
      await api.post(`/projects/${project.id}/materials`, { materialId: material.id })
      onSaved?.()
      onClose()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Save to Project</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        {error && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-stone-500">Loading projects…</p>
        ) : (
          <>
            {projects.length > 0 && (
              <div className="mb-4 space-y-2">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleAdd(p.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-stone-200 px-4 py-3 text-left hover:bg-stone-50"
                  >
                    <span className="font-medium text-stone-800">{p.name}</span>
                    <span className="text-sm text-stone-400">{p._count?.materials || 0} materials</span>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-stone-200 pt-4">
              <label className="label">Create new project</label>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Project name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
                <button onClick={handleCreate} className="btn-accent whitespace-nowrap">Create & Save</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
