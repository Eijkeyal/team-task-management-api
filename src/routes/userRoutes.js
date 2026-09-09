import express from "express";

import {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validations/userValidations.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users. Only administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Administrator privileges required.
 */
router.get("/", authenticate, authorize("ADMIN"), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves details of a specific user. Only administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 6a9d2f718d1aea2d54c476a4
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Administrator privileges required.
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticate, authorize("ADMIN"), getUserById);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: Updates the role of an existing user. Only administrators can perform this operation.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 6a9d2f718d1aea2d54c476a4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - MANAGER
 *                   - MEMBER
 *                 example: MANAGER
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Administrator privileges required.
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id/role",
  authenticate,
  authorize("ADMIN"),
  validate(updateUserRoleSchema),
  updateUserRole,
);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     description: Activates or deactivates a user account. Only administrators can perform this operation.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 6a9d2f718d1aea2d54c476a4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Administrator privileges required.
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(updateUserStatusSchema),
  updateUserStatus,
);

export default router;
