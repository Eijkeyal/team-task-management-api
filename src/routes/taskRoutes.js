import express from "express";

import {
  createTask,
  getTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and assignment endpoints
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a task and assigns it to a project member. Only Admins and Managers can create tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - dueDate
 *               - assignedTo
 *               - project
 *           example:
 *             title: Complete API Documentation
 *             description: Document all REST API endpoints
 *             priority: HIGH
 *             dueDate: "2026-09-25"
 *             assignedTo: 6a9d2f718d1aea2d54c476a4
 *             project: 6a9db401b0d995a123c60c54
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Assigned user is not a member of the project
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admin or Manager role required
 *       404:
 *         description: Project or assigned user not found
 */
router.post("/", authenticate, authorize("ADMIN", "MANAGER"), createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks
 *     description: Retrieves tasks with optional filtering, searching, sorting and pagination. Members only see their assigned tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, COMPLETED]
 *         description: Filter tasks by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         description: Filter tasks by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of tasks per page
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieves detailed information about a specific task. Members can only view tasks assigned to them.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *         example: 6a9db6608c5f507ea9f42df1
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Members can only view their assigned tasks
 *       404:
 *         description: Task not found
 */
router.get("/:id", authenticate, getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates an existing task. Members can only update the task status.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *         example: 6a9db6608c5f507ea9f42df1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, COMPLETED]
 *                 example: IN_PROGRESS
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated task description
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-30"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Members can only update task status
 *       404:
 *         description: Task not found
 */
router.put("/:id", authenticate, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes an existing task. Only Admins and Managers can delete tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *         example: 6a9db6608c5f507ea9f42df1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admin or Manager role required
 *       404:
 *         description: Task not found
 */
router.delete("/:id", authenticate, authorize("ADMIN", "MANAGER"), deleteTask);

export default router;
