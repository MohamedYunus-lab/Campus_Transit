import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all drivers (public)
router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        buses: {
          include: {
            route: true,
          },
        },
      },
    });
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get single driver (public)
router.get('/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        buses: {
          include: {
            route: true,
          },
        },
      },
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// Create driver (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phoneNumber, idCardNumber, photoUrl } = req.body;

    const driver = await prisma.driver.create({
      data: {
        name,
        phoneNumber,
        idCardNumber,
        photoUrl: photoUrl || '/uploads/drivers/default-driver.jpg',
      },
    });

    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

// Update driver (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, phoneNumber, idCardNumber, photoUrl } = req.body;

    const driver = await prisma.driver.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        phoneNumber,
        idCardNumber,
        photoUrl,
      },
    });

    res.json(driver);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

// Delete driver (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.driver.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

export default router;
