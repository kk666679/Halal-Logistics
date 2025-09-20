const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Submit audit log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, description } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!type || !description) {
      return res.status(400).json({
        error: 'Type and description are required'
      });
    }

    const auditLog = await prisma.auditLog.create({
      data: {
        type,
        description,
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
      message: 'Audit log submitted successfully',
      auditLog
    });
  } catch (error) {
    console.error('Submit audit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all audit logs (Admin can see all, others see their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};

    // Admin can see all audit logs, others only their own
    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }

    const auditLogs = await prisma.auditLog.findMany({
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

    res.json({ auditLogs });
  } catch (error) {
    console.error('Get audits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get audit log by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const auditLog = await prisma.auditLog.findUnique({
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

    if (!auditLog) {
      return res.status(404).json({ error: 'Audit log not found' });
    }

    // Check if user can access this audit log
    if (auditLog.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ auditLog });
  } catch (error) {
    console.error('Get audit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get audit logs by type
router.get('/type/:type', authenticateToken, authorizeRoles('ADMIN', 'CERTIFIER'), async (req, res) => {
  try {
    const { type } = req.params;

    const auditLogs = await prisma.auditLog.findMany({
      where: { type },
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

    res.json({ auditLogs });
  } catch (error) {
    console.error('Get audits by type error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete audit log (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const auditLog = await prisma.auditLog.findUnique({
      where: { id }
    });

    if (!auditLog) {
      return res.status(404).json({ error: 'Audit log not found' });
    }

    await prisma.auditLog.delete({
      where: { id }
    });

    res.json({ message: 'Audit log deleted successfully' });
  } catch (error) {
    console.error('Delete audit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
