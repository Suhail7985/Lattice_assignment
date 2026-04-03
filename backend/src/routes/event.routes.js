const express = require('express');
const router = express.Router();
const EventController = require('../controllers/event.controller');
const AttendanceController = require('../controllers/attendance.controller');
const { eventValidation, attendanceValidation } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve a list of all events
 *     responses:
 *       200:
 *         description: A list of events.
 */
router.get('/', EventController.getEvents);

/**
 * @swagger
 * /events/upcoming:
 *   get:
 *     summary: Retrieve a list of upcoming events with available tickets
 *     responses:
 *       200:
 *         description: A list of upcoming events.
 */
router.get('/upcoming', EventController.getUpcomingEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               total_capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully.
 */
router.post('/', eventValidation, EventController.createEvent);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success.
 *       404:
 *         description: Event not found.
 */
router.get('/:id', EventController.getEventById);

/**
 * @swagger
 * /events/{id}/attendance:
 *   post:
 *     summary: Mark attendance for an event using a ticket code
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attendance marked successfully.
 *       400:
 *         description: Invalid code or already marked.
 */
router.post('/:id/attendance', attendanceValidation, AttendanceController.markAttendance);

module.exports = router;
