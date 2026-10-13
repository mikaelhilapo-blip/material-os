import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import Navbar from './components/Navbar.jsx'
import CompareBar from './components/CompareBar.jsx'
import Discover from './pages/Discover.jsx'
import MaterialDetail from './pages/MaterialDetail.jsx'
import Compare from './pages/Compare.jsx'
import MyMaterials from './pages/MyMaterials.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Login from './pages/Login.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="px-4 py-12 text-stone-500">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20">
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/material/:id" element={<MaterialDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-materials" element={
            <ProtectedRoute><MyMaterials /></ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute><Projects /></ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute><ProjectDetail /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CompareBar />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <AppRoutes />
      </CompareProvider>
    </AuthProvider>
  )
}
