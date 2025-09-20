const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create new shipment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product, origin, destination, trackingId } = req.body;
    const ownerId = req.user.id;

    // Validate input
    if (!product || !origin || !destination || !trackingId) {
      return res.status(400).json({
        error: 'Product, origin, destination, and tracking ID are required'
      });
    }

    // Check if tracking ID already exists
    const existingShipment = await prisma.shipment.findUnique({
      where: { trackingId }
    });

    if (existingShipment) {
      return res.status(400).json({ error: 'Tracking ID already exists' });
    }

    const shipment = await prisma.shipment.create({
      data: {
        product,
        origin,
        destination,
        trackingId,
        ownerId,
        status: 'CREATED'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all shipments (Admin can see all, others see their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};

    // Admin can see all shipments, others only their own
    if (req.user.role !== 'ADMIN') {
      whereClause.ownerId = req.user.id;
    }

    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ shipments });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shipment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Check if user can access this shipment
    if (shipment.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ shipment });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Track shipment by tracking ID (public endpoint)
router.get('/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;

    const shipment = await prisma.shipment.findUnique({
      where: { trackingId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({ shipment });
  } catch (error) {
    console.error('Track shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shipment status
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN', 'PROVIDER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['CREATED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required (CREATED, IN_TRANSIT, DELIVERED, FAILED)'
      });
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.json({
      message: 'Shipment status updated successfully',
      shipment: updatedShipment
    });
  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shipment certification status
router.patch('/:id/certify', authenticateToken, authorizeRoles('ADMIN', 'CERTIFIER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { certified } = req.body;

    if (typeof certified !== 'boolean') {
      return res.status(400).json({
        error: 'Certified status must be a boolean'
      });
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: { certified },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.json({
      message: 'Shipment certification status updated successfully',
      shipment: updatedShipment
    });
  } catch (error) {
    console.error('Update shipment certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete shipment (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    await prisma.shipment.delete({
      where: { id }
    });

    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
