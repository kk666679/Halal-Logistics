const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Submit certification request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { companyName, productType } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!companyName || !productType) {
      return res.status(400).json({
        error: 'Company name and product type are required'
      });
    }

    const certification = await prisma.certificationRequest.create({
      data: {
        companyName,
        productType,
        submittedBy: userId
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
      message: 'Certification request submitted successfully',
      certification
    });
  } catch (error) {
    console.error('Submit certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all certification requests (Admin and Certifier can see all)
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CERTIFIER'), async (req, res) => {
  try {
    const certifications = await prisma.certificationRequest.findMany({
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

    res.json({ certifications });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's own certification requests
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const certifications = await prisma.certificationRequest.findMany({
      where: { submittedBy: req.user.id },
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

    res.json({ certifications });
  } catch (error) {
    console.error('Get my certifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get certification by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await prisma.certificationRequest.findUnique({
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

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    // Check if user can access this certification
    if (certification.submittedBy !== req.user.id &&
        !['ADMIN', 'CERTIFIER'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ certification });
  } catch (error) {
    console.error('Get certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update certification status (Certifier and Admin only)
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN', 'CERTIFIER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required (PENDING, APPROVED, REJECTED, EXPIRED)'
      });
    }

    const certification = await prisma.certificationRequest.findUnique({
      where: { id }
    });

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    const updatedCertification = await prisma.certificationRequest.update({
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
      message: 'Certification status updated successfully',
      certification: updatedCertification
    });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete certification request (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await prisma.certificationRequest.findUnique({
      where: { id }
    });

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    await prisma.certificationRequest.delete({
      where: { id }
    });

    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
