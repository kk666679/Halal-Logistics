const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Add inventory item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productName, quantity, location, halalCertified } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!productName || !quantity || !location) {
      return res.status(400).json({
        error: 'Product name, quantity, and location are required'
      });
    }

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        productName,
        quantity: parseInt(quantity),
        location,
        halalCertified: halalCertified || false,
        userId
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
      message: 'Inventory item added successfully',
      inventoryItem
    });
  } catch (error) {
    console.error('Add inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all inventory items (Admin can see all, others see their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};

    // Admin can see all inventory, others only their own
    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }

    const inventoryItems = await prisma.inventoryItem.findMany({
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

    res.json({ inventoryItems });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inventory item by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await prisma.inventoryItem.findUnique({
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

    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Check if user can access this inventory item
    if (inventoryItem.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ inventoryItem });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update inventory item
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, quantity, location, halalCertified } = req.body;

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id }
    });

    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Check if user can update this inventory item
    if (inventoryItem.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (productName !== undefined) updateData.productName = productName;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (location !== undefined) updateData.location = location;
    if (halalCertified !== undefined) updateData.halalCertified = halalCertified;

    const updatedInventoryItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
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
      message: 'Inventory item updated successfully',
      inventoryItem: updatedInventoryItem
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Halal certified items only
router.get('/certified/halal', authenticateToken, authorizeRoles('ADMIN', 'CERTIFIER'), async (req, res) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { halalCertified: true },
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

    res.json({ inventoryItems });
  } catch (error) {
    console.error('Get halal certified inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inventory by location
router.get('/location/:location', authenticateToken, async (req, res) => {
  try {
    const { location } = req.params;

    let whereClause = { location };

    // Non-admin users can only see their own inventory
    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }

    const inventoryItems = await prisma.inventoryItem.findMany({
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

    res.json({ inventoryItems });
  } catch (error) {
    console.error('Get inventory by location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id }
    });

    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Check if user can delete this inventory item
    if (inventoryItem.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.inventoryItem.delete({
      where: { id }
    });

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
