import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all boarding points (public)
router.get('/', async (req, res) => {
  try {
    const boardingPoints = await prisma.boardingPoint.findMany({
      include: {
        route: true,
        schedules: {
          include: {
            bus: {
              include: {
                driver: true,
              },
            },
          },
        },
      },
    });
    res.json(boardingPoints);
  } catch (error) {
    console.error('Error fetching boarding points:', error);
    res.status(500).json({ error: 'Failed to fetch boarding points' });
  }
});

// Get single boarding point (public)
router.get('/:id', async (req, res) => {
  try {
    const boardingPoint = await prisma.boardingPoint.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        route: true,
        schedules: {
          include: {
            bus: {
              include: {
                driver: true,
              },
            },
          },
          orderBy: {
            arrivalTime: 'asc',
          },
        },
      },
    });

    if (!boardingPoint) {
      return res.status(404).json({ error: 'Boarding point not found' });
    }

    res.json(boardingPoint);
  } catch (error) {
    console.error('Error fetching boarding point:', error);
    res.status(500).json({ error: 'Failed to fetch boarding point' });
  }
});

// Create boarding point (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, latitude, longitude, routeId, imageUrl } = req.body;

    const boardingPoint = await prisma.boardingPoint.create({
      data: {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        routeId: parseInt(routeId),
        imageUrl: imageUrl || null,
      },
      include: {
        route: true,
      },
    });

    res.status(201).json(boardingPoint);
  } catch (error) {
    console.error('Error creating boarding point:', error);
    res.status(500).json({ error: 'Failed to create boarding point' });
  }
});

// Update boarding point (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, latitude, longitude, routeId, imageUrl } = req.body;

    const boardingPoint = await prisma.boardingPoint.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        routeId: parseInt(routeId),
        imageUrl: imageUrl || null,
      },
      include: {
        route: true,
      },
    });

    res.json(boardingPoint);
  } catch (error) {
    console.error('Error updating boarding point:', error);
    res.status(500).json({ error: 'Failed to update boarding point' });
  }
});

// Delete boarding point (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.boardingPoint.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Boarding point deleted successfully' });
  } catch (error) {
    console.error('Error deleting boarding point:', error);
    res.status(500).json({ error: 'Failed to delete boarding point' });
  }
});

export default router;
