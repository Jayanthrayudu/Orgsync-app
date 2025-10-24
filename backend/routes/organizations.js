const express = require('express');
const OrganizationController = require('../controllers/organizationController');

const router = express.Router();

// GET /api/organizations - Get all organizations
router.get('/', OrganizationController.getAllOrganizations);

// GET /api/organizations/:id - Get organization by ID
router.get('/:id', OrganizationController.getOrganizationById);

// POST /api/organizations - Create organization
router.post('/', OrganizationController.createOrganization);

// PUT /api/organizations/:id - Update organization
router.put('/:id', OrganizationController.updateOrganization);

// PATCH /api/organizations/:id/status - Update status
router.patch('/:id/status', OrganizationController.updateOrganizationStatus);

// DELETE /api/organizations/:id - Delete organization
router.delete('/:id', OrganizationController.deleteOrganization);

module.exports = router;
