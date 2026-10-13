import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            Material<span className="text-accent">OS</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/" className="btn-ghost text-sm">Discover</Link>
          <Link to="/compare" className="btn-ghost text-sm">Compare</Link>
          {user && <Link to="/my-materials" className="btn-ghost text-sm">My Materials</Link>}
          {user && <Link to="/projects" className="btn-ghost text-sm">Projects</Link>}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-stone-500 sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="btn-outline text-sm">Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
