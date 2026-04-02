const pool = require('../config/db');

class EventService {
    static async getAllEvents() {
        const [rows] = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
        return rows;
    }

    static async getUpcomingEvents() {
        const [rows] = await pool.query('SELECT * FROM events WHERE event_date > NOW() AND remaining_tickets > 0 ORDER BY event_date ASC');
        return rows;
    }

    static async createEvent(eventData) {
        const { title, description, event_date, total_capacity } = eventData;
        const remaining_tickets = total_capacity;
        
        const [result] = await pool.query(
            'INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)',
            [title, description, event_date, total_capacity, remaining_tickets]
        );
        
        return { id: result.insertId, ...eventData, remaining_tickets };
    }

    static async getEventById(id) {
        const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = EventService;
