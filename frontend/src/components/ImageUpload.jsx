import { useState, useRef } from 'react'
import { api } from '../api/client.js'

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }
    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const result = await api.uploadFile('/materials/upload', formData)
      onChange(result.url)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-sm">
      {value ? (
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
            <img src={value} alt="Material preview" className="h-full w-full object-cover" />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-outline text-sm"
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={() => { onChange(''); setError(null) }}
              className="btn-ghost text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 text-stone-400 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-sm">Uploading…</span>
          ) : (
            <>
              <svg className="mb-2 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="mt-1 text-xs">PNG, JPG up to 5MB</span>
            </>
          )}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          handleFile(e.target.files[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
