const AttendanceService = require('../services/attendance.service');

class AttendanceController {
    static async markAttendance(req, res, next) {
        try {
            const { ticket_code } = req.body;
            const { id } = req.params; // Event ID
            const result = await AttendanceService.markAttendance(ticket_code, id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getEventAttendance(req, res, next) {
        try {
            const { id } = req.params; // Event ID
            const attendance = await AttendanceService.getEventAttendance(id);
            res.status(200).json({ success: true, count: attendance.length, data: attendance });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AttendanceController;
