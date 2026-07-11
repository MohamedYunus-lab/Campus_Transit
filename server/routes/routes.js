import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all routes (public)
router.get('/', async (req, res) => {
  try {
    const routes = await prisma.busRoute.findMany({
      include: {
        boardingPoints: true,
        buses: {
          include: {
            driver: true,
          },
        },
      },
    });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get single route (public)
router.get('/:id', async (req, res) => {
  try {
    const route = await prisma.busRoute.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        boardingPoints: {
          include: {
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
        },
        buses: {
          include: {
            driver: true,
          },
        },
      },
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Create route (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { routeName, startPoint, endPoint, totalStops } = req.body;

    const route = await prisma.busRoute.create({
      data: {
        routeName,
        startPoint,
        endPoint,
        totalStops: totalStops || 0,
      },
    });

    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// Update route (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { routeName, startPoint, endPoint, totalStops } = req.body;

    const route = await prisma.busRoute.update({
      where: { id: parseInt(req.params.id) },
      data: {
        routeName,
        startPoint,
        endPoint,
        totalStops,
      },
    });

    res.json(route);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// Delete route (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.busRoute.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

export default router;
