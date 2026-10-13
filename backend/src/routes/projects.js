import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// List user's projects
router.get('/', requireAuth, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId },
    include: { _count: { select: { materials: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(projects)
})

// Get single project with materials
router.get('/:id', requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { materials: { include: { material: true } } }
  })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.userId !== req.userId)
    return res.status(403).json({ error: 'Access denied' })
  res.json(project)
})

// Create project
router.post('/', requireAuth, async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'Project name is required' })
  const project = await prisma.project.create({
    data: { name, description, userId: req.userId }
  })
  res.status(201).json(project)
})

// Update project
router.put('/:id', requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.userId !== req.userId)
    return res.status(403).json({ error: 'Access denied' })

  const { name, description } = req.body
  const updated = await prisma.project.update({
    where: { id: req.params.id },
    data: { name, description }
  })
  res.json(updated)
})

// Delete project
router.delete('/:id', requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.userId !== req.userId)
    return res.status(403).json({ error: 'Access denied' })

  await prisma.project.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// Add material to project
router.post('/:id/materials', requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.userId !== req.userId)
    return res.status(403).json({ error: 'Access denied' })

  const { materialId } = req.body
  if (!materialId) return res.status(400).json({ error: 'Material ID is required' })

  // Verify material is accessible to user
  const material = await prisma.material.findUnique({ where: { id: materialId } })
  if (!material) return res.status(404).json({ error: 'Material not found' })
  if (material.source === 'USER_CREATED' && material.userId !== req.userId)
    return res.status(403).json({ error: 'Material not accessible' })

  try {
    const pm = await prisma.projectMaterial.create({
      data: { projectId: req.params.id, materialId }
    })
    res.status(201).json(pm)
  } catch (e) {
    if (e.code === 'P2002')
      return res.status(409).json({ error: 'Material already in project' })
    throw e
  }
})

// Remove material from project
router.delete('/:id/materials/:materialId', requireAuth, async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.userId !== req.userId)
    return res.status(403).json({ error: 'Access denied' })

  await prisma.projectMaterial.deleteMany({
    where: { projectId: req.params.id, materialId: req.params.materialId }
  })
  res.json({ success: true })
})

export default router
