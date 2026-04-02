const BookingService = require('../services/booking.service');

class BookingController {
    static async createBooking(req, res, next) {
        try {
            const { user_id, event_id } = req.body;
            const booking = await BookingService.createBooking(user_id, event_id);
            res.status(201).json({ success: true, data: booking });
        } catch (error) {
            next(error);
        }
    }

    static async getBookingsByUser(req, res, next) {
        try {
            const bookings = await BookingService.getBookingsByUser(req.params.user_id);
            res.status(200).json({ success: true, count: bookings.length, data: bookings });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BookingController;
