const EventService = require('../services/event.service');

class EventController {
    static async getEvents(req, res, next) {
        try {
            const events = await EventService.getAllEvents();
            res.status(200).json({ success: true, count: events.length, data: events });
        } catch (error) {
            next(error);
        }
    }

    static async getUpcomingEvents(req, res, next) {
        try {
            const events = await EventService.getUpcomingEvents();
            res.status(200).json({ success: true, count: events.length, data: events });
        } catch (error) {
            next(error);
        }
    }

    static async createEvent(req, res, next) {
        try {
            const event = await EventService.createEvent(req.body);
            res.status(201).json({ success: true, data: event });
        } catch (error) {
            next(error);
        }
    }

    static async getEventById(req, res, next) {
        try {
            const event = await EventService.getEventById(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(200).json({ success: true, data: event });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = EventController;
