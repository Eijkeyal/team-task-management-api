import express from "express";

import { register, login } from "../controllers/authController.js";

import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";

import { registerSchema, loginSchema } from "../validations/authValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account after validating the provided registration details.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: Test Member
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: member1@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's account password
 *                 example: Member@123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *
 *       400:
 *         description: Validation error or user already exists
 *
 *       500:
 *         description: Internal server error
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a registered user and returns an access token and refresh token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered user's email address
 *                 example: admin@taskmanager.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: Admin@123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 6a9d34ffe202335f44ff2eed
 *                     name:
 *                       type: string
 *                       example: System Admin
 *                     email:
 *                       type: string
 *                       example: admin@taskmanager.com
 *                     role:
 *                       type: string
 *                       example: ADMIN
 *
 *       401:
 *         description: Invalid email or password
 *
 *       400:
 *         description: Validation error
 *
 *       500:
 *         description: Internal server error
 */
router.post("/login", validate(loginSchema), login);

export default router;
