import { useState } from 'react'
import { api } from '../api/client.js'
import { useMaterials } from '../hooks/useMaterials.js'
import MaterialCard from '../components/MaterialCard.jsx'
import SaveToProjectModal from '../components/SaveToProjectModal.jsx'

const CATEGORIES = ['Tiles', 'Flooring', 'Paint', 'Wood', 'Stone', 'Laminates', 'Other']

const EMPTY_FORM = {
  name: '', category: 'Tiles', brand: '', supplier: '', price: '',
  sizes: '', finish: '', notes: '', image: '',
  composition: '', durability: '', performance: '', maintenance: '',
  availability: '', warranty: '',
}

export default function MyMaterials() {
  const { materials, loading, error, refetch } = useMaterials()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [saveTarget, setSaveTarget] = useState(null)

  const myMaterials = materials.filter(m => m.source === 'USER_CREATED')

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (m) => {
    setEditing(m.id)
    setForm({ ...EMPTY_FORM, ...m })
    setFormError(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('Name is required'); return }
    setSaving(true)
    setFormError(null)
    try {
      if (editing) {
        await api.put(`/materials/${editing}`, form)
      } else {
        await api.post('/materials', form)
      }
      setShowForm(false)
      refetch()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (m) => {
    if (!confirm(`Delete "${m.name}"?`)) return
    try {
      await api.del(`/materials/${m.id}`)
      refetch()
    } catch (e) {
      alert(e.message)
    }
  }

  const update = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">My Materials</h1>
          <p className="mt-1 text-sm text-stone-500">Add and manage your own material records.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Material</button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 p-6">
          <h2 className="mb-4 text-lg font-semibold">{editing ? 'Edit Material' : 'New Material'}</h2>
          {formError && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input className="input" value={form.name} onChange={update('name')} required />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={update('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Brand</label>
              <input className="input" value={form.brand} onChange={update('brand')} />
            </div>
            <div>
              <label className="label">Supplier</label>
              <input className="input" value={form.supplier} onChange={update('supplier')} />
            </div>
            <div>
              <label className="label">Price</label>
              <input className="input" placeholder="$X / unit" value={form.price} onChange={update('price')} />
            </div>
            <div>
              <label className="label">Sizes</label>
              <input className="input" placeholder='e.g. 12"x24"' value={form.sizes} onChange={update('sizes')} />
            </div>
            <div>
              <label className="label">Finish</label>
              <input className="input" value={form.finish} onChange={update('finish')} />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input className="input" placeholder="https://…" value={form.image} onChange={update('image')} />
            </div>
            <div>
              <label className="label">Composition</label>
              <input className="input" value={form.composition} onChange={update('composition')} />
            </div>
            <div>
              <label className="label">Durability</label>
              <input className="input" value={form.durability} onChange={update('durability')} />
            </div>
            <div>
              <label className="label">Performance</label>
              <input className="input" value={form.performance} onChange={update('performance')} />
            </div>
            <div>
              <label className="label">Maintenance</label>
              <input className="input" value={form.maintenance} onChange={update('maintenance')} />
            </div>
            <div>
              <label className="label">Availability</label>
              <input className="input" value={form.availability} onChange={update('availability')} />
            </div>
            <div>
              <label className="label">Warranty</label>
              <input className="input" value={form.warranty} onChange={update('warranty')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input min-h-[80px]" value={form.notes} onChange={update('notes')} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : editing ? 'Update Material' : 'Add Material'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : myMaterials.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500">You haven't added any materials yet.</p>
          <button onClick={openCreate} className="btn-primary mt-4">+ Add Your First Material</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myMaterials.map(m => (
            <div key={m.id} className="relative">
              <MaterialCard material={m} onSave={setSaveTarget} />
              <div className="mt-2 flex gap-2 px-1">
                <button onClick={() => openEdit(m)} className="flex-1 rounded-lg border border-stone-300 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100">
                  Edit
                </button>
                <button onClick={() => handleDelete(m)} className="flex-1 rounded-lg border border-stone-300 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {saveTarget && (
        <SaveToProjectModal material={saveTarget} onClose={() => setSaveTarget(null)} />
      )}
    </div>
  )
}
