const pool = require('../config/db');
const crypto = require('crypto');

class BookingService {
    static async createBooking(userId, eventId) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. SELECT ... FOR UPDATE (Lock the event row to prevent race conditions)
            const [eventRows] = await connection.execute(
                'SELECT id, title, remaining_tickets, total_capacity FROM events WHERE id = ? FOR UPDATE',
                [eventId]
            );

            if (eventRows.length === 0) {
                throw new Error('Event not found');
            }

            const event = eventRows[0];

            // 2. Check Capacity
            if (event.remaining_tickets <= 0) {
                throw new Error('Event is sold out');
            }

            // 3. Generate unique ticket code
            const ticketCode = `TKT-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${eventId}-${userId}`;

            // 4. Create Booking
            const [bookingResult] = await connection.execute(
                'INSERT INTO bookings (user_id, event_id, ticket_code) VALUES (?, ?, ?)',
                [userId, eventId, ticketCode]
            );

            // 5. Decrement remaining tickets safely
            await connection.execute(
                'UPDATE events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?',
                [eventId]
            );

            await connection.commit();

            return {
                bookingId: bookingResult.insertId,
                userId,
                eventId,
                ticketCode,
                eventName: event.title
            };

        } catch (error) {
            await connection.rollback();
            console.error('Booking Transaction Failed:', error.message);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getBookingsByUser(userId) {
        const [rows] = await pool.query(
            'SELECT b.*, e.title as event_title, e.date FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.user_id = ?',
            [userId]
        );
        return rows;
    }

    static async getBookingForAttendance(ticketCode, eventId) {
        const [rows] = await pool.query(
            'SELECT b.id, b.ticket_code, b.event_id, b.user_id FROM bookings b WHERE b.ticket_code = ? AND b.event_id = ?',
            [ticketCode, eventId]
        );
        return rows[0];
    }
}

module.exports = BookingService;
