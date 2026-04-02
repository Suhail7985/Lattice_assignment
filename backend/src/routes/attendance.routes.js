const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendance.controller');
const { attendanceValidation } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /attendance/event/{id}:
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
router.post('/event/:id', attendanceValidation, AttendanceController.markAttendance);

/**
 * @swagger
 * /attendance/event/{id}:
 *   get:
 *     summary: Get all attendees for an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of attendees.
 */
router.get('/event/:id', AttendanceController.getEventAttendance);

module.exports = router;
