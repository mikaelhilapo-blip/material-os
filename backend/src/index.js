import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import materialRoutes from './routes/materials.js'
import projectRoutes from './routes/projects.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/projects', projectRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))
