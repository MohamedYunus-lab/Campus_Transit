import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all buses (public)
router.get('/', async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
      include: {
        driver: true,
        route: true,
        schedules: {
          include: {
            boardingPoint: true,
          },
        },
      },
    });
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Get single bus (public)
router.get('/:id', async (req, res) => {
  try {
    const bus = await prisma.bus.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        driver: true,
        route: {
          include: {
            boardingPoints: true,
          },
        },
        schedules: {
          include: {
            boardingPoint: true,
          },
          orderBy: {
            arrivalTime: 'asc',
          },
        },
      },
    });

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
});

// Create bus (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { busNumber, capacity, driverId, routeId } = req.body;

    const bus = await prisma.bus.create({
      data: {
        busNumber,
        capacity: parseInt(capacity),
        driverId: parseInt(driverId),
        routeId: parseInt(routeId),
      },
      include: {
        driver: true,
        route: true,
      },
    });

    res.status(201).json(bus);
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({ error: 'Failed to create bus' });
  }
});

// Update bus (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { busNumber, capacity, driverId, routeId } = req.body;

    const bus = await prisma.bus.update({
      where: { id: parseInt(req.params.id) },
      data: {
        busNumber,
        capacity: parseInt(capacity),
        driverId: parseInt(driverId),
        routeId: parseInt(routeId),
      },
      include: {
        driver: true,
        route: true,
      },
    });

    res.json(bus);
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Failed to update bus' });
  }
});

// Delete bus (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.bus.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Failed to delete bus' });
  }
});

export default router;
