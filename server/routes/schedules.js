import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all schedules (public)
router.get('/', async (req, res) => {
  try {
    const schedules = await prisma.busSchedule.findMany({
      include: {
        bus: {
          include: {
            driver: true,
            route: true,
          },
        },
        boardingPoint: true,
      },
      orderBy: {
        arrivalTime: 'asc',
      },
    });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Get single schedule (public)
router.get('/:id', async (req, res) => {
  try {
    const schedule = await prisma.busSchedule.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        bus: {
          include: {
            driver: true,
            route: true,
          },
        },
        boardingPoint: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Create schedule (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { busId, boardingPointId, arrivalTime, departureTime } = req.body;

    const schedule = await prisma.busSchedule.create({
      data: {
        busId: parseInt(busId),
        boardingPointId: parseInt(boardingPointId),
        arrivalTime,
        departureTime,
      },
      include: {
        bus: true,
        boardingPoint: true,
      },
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Update schedule (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { busId, boardingPointId, arrivalTime, departureTime } = req.body;

    const schedule = await prisma.busSchedule.update({
      where: { id: parseInt(req.params.id) },
      data: {
        busId: parseInt(busId),
        boardingPointId: parseInt(boardingPointId),
        arrivalTime,
        departureTime,
      },
      include: {
        bus: true,
        boardingPoint: true,
      },
    });

    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// Delete schedule (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.busSchedule.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;
