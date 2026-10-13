import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext.jsx'

export default function CompareBar() {
  const { ids, clear } = useCompare()
  if (ids.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-stone-700">
            {ids.length} selected for comparison
          </span>
          <div className="flex -space-x-2">
            {ids.map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-stone-300" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clear} className="btn-ghost text-sm">Clear</button>
          <Link to="/compare" className="btn-primary text-sm">
            Compare {ids.length > 0 && `(${ids.length})`}
          </Link>
        </div>
      </div>
    </div>
  )
}
