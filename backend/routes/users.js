const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

// GET /api/users/:orgId - Get users by organization
router.get('/:orgId', UserController.getUsersByOrganization);

// POST /api/users/:orgId - Create user for organization
router.post('/:orgId', UserController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

module.exports = router;