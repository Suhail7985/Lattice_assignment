const pool = require('../config/db');

class EventService {
    static async getAllEvents() {
        const [rows] = await pool.query('SELECT * FROM events ORDER BY date ASC');
        return rows;
    }

    static async getUpcomingEvents() {
        const [rows] = await pool.query('SELECT * FROM events WHERE date > NOW() AND remaining_tickets > 0 ORDER BY date ASC');
        return rows;
    }

    static async createEvent(eventData) {
        const { title, description, date, total_capacity } = eventData;
        const remaining_tickets = total_capacity;
        
        const [result] = await pool.query(
            'INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)',
            [title, description, date, total_capacity, remaining_tickets]
        );
        
        return { id: result.insertId, ...eventData, remaining_tickets };
    }

    static async getEventById(id) {
        const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = EventService;
