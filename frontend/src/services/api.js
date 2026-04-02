import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(message);
  }
);

export const eventService = {
  getEvents: () => api.get('/events'),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  createEvent: (data) => api.post('/events', data),
  getEvent: (id) => api.get(`/events/${id}`),
};

export const bookingService = {
  createBooking: (userId, eventId) => api.post('/bookings', { user_id: userId, event_id: eventId }),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
};

export const attendanceService = {
  markAttendance: (eventId, ticketCode) => api.post(`/attendance/event/${eventId}`, { ticket_code: ticketCode }),
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`),
};

export default api;
