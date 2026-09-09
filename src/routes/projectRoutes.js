import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updatedProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/projectController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/**
 * All project routes require authentication.
 */
router.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieves a list of all projects available to the authenticated user.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieves detailed information about a specific project.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *         example: 6a9db401b0d995a123c60c54
 *
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project. Only ADMIN and MANAGER users are authorized to perform this operation.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Project name
 *                 example: Test Project
 *               description:
 *                 type: string
 *                 description: Project description
 *                 example: Project for testing task management
 *
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN and MANAGER users are allowed
 *       500:
 *         description: Internal server error
 */
router.post("/", authorize("ADMIN", "MANAGER"), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     description: Updates an existing project. Only ADMIN and MANAGER users are authorized.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *         example: 6a9db401b0d995a123c60c54
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 example: Updated project description
 *
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN and MANAGER users are allowed
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authorize("ADMIN", "MANAGER"), updatedProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Deletes an existing project. Only ADMIN and MANAGER users are authorized.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *         example: 6a9db401b0d995a123c60c54
 *
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN and MANAGER users are allowed
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authorize("ADMIN", "MANAGER"), deleteProject);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   post:
 *     summary: Add a member to a project
 *     description: Adds an existing user as a member of a project. Only ADMIN and MANAGER users are authorized.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *         example: 6a9db401b0d995a123c60c54
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to add to the project
 *                 example: 6a9d2f718d1aea2d54c476a4
 *
 *     responses:
 *       200:
 *         description: Member added successfully
 *       400:
 *         description: User is already a project member
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN and MANAGER users are allowed
 *       404:
 *         description: Project or user not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/members", authorize("ADMIN", "MANAGER"), addProjectMember);

/**
 * @swagger
 * /api/projects/{id}/members:
 *   delete:
 *     summary: Remove a member from a project
 *     description: Removes a member from an existing project. Only ADMIN and MANAGER users are authorized.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *         example: 6a9db401b0d995a123c60c54
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to remove from the project
 *                 example: 6a9d2f718d1aea2d54c476a4
 *
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only ADMIN and MANAGER users are allowed
 *       404:
 *         description: Project or member not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id/members",
  authorize("ADMIN", "MANAGER"),
  removeProjectMember,
);

export default router;
