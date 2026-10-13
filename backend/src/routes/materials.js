import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// List materials: supplier listings (public) + user's own (private)
router.get('/', optionalAuth, async (req, res) => {
  const { search, category } = req.query

  const orConditions = [{ source: 'SUPPLIER_LISTING' }]
  if (req.userId) {
    orConditions.push({ source: 'USER_CREATED', userId: req.userId })
  }

  const andConditions = [{ OR: orConditions }]

  if (category && category !== 'All') {
    andConditions.push({ category })
  }

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } },
      ]
    })
  }

  const materials = await prisma.material.findMany({
    where: { AND: andConditions },
    orderBy: { createdAt: 'desc' }
  })
  res.json(materials)
})

// Get single material
router.get('/:id', optionalAuth, async (req, res) => {
  const material = await prisma.material.findUnique({
    where: { id: req.params.id }
  })
  if (!material) return res.status(404).json({ error: 'Material not found' })

  // Hide other users' private materials
  if (material.source === 'USER_CREATED' && material.userId !== req.userId) {
    return res.status(404).json({ error: 'Material not found' })
  }
  res.json(material)
})

// Create material (user-created, private)
router.post('/', requireAuth, async (req, res) => {
  const data = {
    ...req.body,
    source: 'USER_CREATED',
    userId: req.userId,
  }
  delete data.id
  const material = await prisma.material.create({ data })
  res.status(201).json(material)
})

// Update material (only own user-created materials)
router.put('/:id', requireAuth, async (req, res) => {
  const material = await prisma.material.findUnique({ where: { id: req.params.id } })
  if (!material) return res.status(404).json({ error: 'Material not found' })
  if (material.userId !== req.userId || material.source !== 'USER_CREATED')
    return res.status(403).json({ error: 'You can only edit your own materials' })

  const data = { ...req.body }
  delete data.id
  delete data.source
  delete data.userId
  const updated = await prisma.material.update({ where: { id: req.params.id }, data })
  res.json(updated)
})

// Delete material (only own user-created materials)
router.delete('/:id', requireAuth, async (req, res) => {
  const material = await prisma.material.findUnique({ where: { id: req.params.id } })
  if (!material) return res.status(404).json({ error: 'Material not found' })
  if (material.userId !== req.userId || material.source !== 'USER_CREATED')
    return res.status(403).json({ error: 'You can only delete your own materials' })

  await prisma.material.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

export default router
