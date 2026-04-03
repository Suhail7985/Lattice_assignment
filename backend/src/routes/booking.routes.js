const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const { bookingValidation } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book a ticket for an event
 *     description: Uses SELECT ... FOR UPDATE to handle concurrent booking attempts.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               event_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ticket booked successfully.
 *       400:
 *         description: Sold out or event not found.
 */
router.post('/', bookingValidation, BookingController.createBooking);



module.exports = router;
