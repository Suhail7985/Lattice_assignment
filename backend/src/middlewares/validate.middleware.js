const { validationResult, body, param } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};

const eventValidation = [
    body('title').notEmpty().withMessage('Title is required').isString(),
    body('description').optional().isString(),
    body('event_date').notEmpty().withMessage('Event date is required').isISO8601(),
    body('total_capacity').notEmpty().isInt({ min: 1 }).withMessage('Total capacity must be at least 1'),
    validate
];

const bookingValidation = [
    body('user_id').notEmpty().isInt().withMessage('User ID is required'),
    body('event_id').notEmpty().isInt().withMessage('Event ID is required'),
    validate
];

const attendanceValidation = [
    param('id').isInt().withMessage('Invalid event ID'),
    body('ticket_code').notEmpty().withMessage('Ticket code is required'),
    validate
];

module.exports = {
    eventValidation,
    bookingValidation,
    attendanceValidation
};
