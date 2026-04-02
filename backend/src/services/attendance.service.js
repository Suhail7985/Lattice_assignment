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

            // 2. Prevent Duplicate Entries (Check if attendance already marked)
            const [attendanceRows] = await connection.execute(
                'SELECT id FROM attendance WHERE booking_id = ? FOR UPDATE', // Lock the attendance row
                [booking.id]
            );

            if (attendanceRows.length > 0) {
                throw new Error('Attendance already marked for this ticket');
            }

            // 3. Insert Attendance
            const [result] = await connection.execute(
                'INSERT INTO attendance (booking_id) VALUES (?)',
                [booking.id]
            );

            await connection.commit();

            return {
                id: result.insertId,
                bookingId: booking.id,
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
            'SELECT a.*, u.name, u.email FROM attendance a JOIN bookings b ON a.booking_id = b.id JOIN users u ON b.user_id = u.id WHERE b.event_id = ?',
            [eventId]
        );
        return rows;
    }
}

module.exports = AttendanceService;
