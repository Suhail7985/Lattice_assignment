const pool = require('../config/db');
const BookingService = require('./booking.service');

class AttendanceService {
    static async markAttendance(ticketCode, eventId) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Validate if booking exists for this ticket code and event
            const booking = await BookingService.getBookingForAttendance(ticketCode, eventId);
            if (!booking) {
                throw new Error('Invalid ticket code for this event');
            }

            // 2. Prevent Duplicate Entries (Check if this user already marked attendance for this event)
            const [attendanceRows] = await connection.execute(
                'SELECT id FROM attendance WHERE user_id = ? AND event_id = ? FOR UPDATE', // Lock the attendance row
                [booking.user_id, eventId]
            );

            if (attendanceRows.length > 0) {
                throw new Error('Attendance already marked for this ticket');
            }

            // 3. Insert Attendance
            const [result] = await connection.execute(
                'INSERT INTO attendance (user_id, event_id) VALUES (?, ?)',
                [booking.user_id, eventId]
            );

            await connection.commit();

            // 4. Also fetch total tickets booked by user for validation feedback
            const [totalTickets] = await connection.execute(
                'SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND event_id = ?',
                [booking.user_id, eventId]
            );

            return {
                id: result.insertId,
                userId: booking.user_id,
                eventId,
                totalTicketsBooked: totalTickets[0].count,
                status: 'Success',
                entryTime: new Date()
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getEventAttendance(eventId) {
        const [rows] = await pool.query(
            'SELECT a.*, u.name, u.email FROM attendance a JOIN users u ON a.user_id = u.id WHERE a.event_id = ?',
            [eventId]
        );
        return rows;
    }
}

module.exports = AttendanceService;
