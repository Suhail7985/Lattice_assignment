const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');

/**
 * @swagger
 * /users/{id}/bookings:
 *   get:
 *     summary: Get all bookings for a specific user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of user's bookings.
 */
router.get('/:id/bookings', BookingController.getBookingsByUser);

module.exports = router;
