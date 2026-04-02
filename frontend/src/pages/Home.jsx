import React, { useEffect, useState } from 'react';
import { eventService, bookingService } from '../services/api';
import { Calendar, Users, MapPin, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getUpcomingEvents();
            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleBook = async (eventId) => {
        setBookingId(eventId);
        setError(null);
        setSuccess(null);
        try {
            const userId = 1; // Simulated User ID
            const response = await bookingService.createBooking(userId, eventId);
            setSuccess(`Success! Ticket code: ${response.data.ticketCode}`);
            fetchEvents(); // Refresh to update remaining tickets
        } catch (err) {
            setError(err);
        } finally {
            setBookingId(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-outfit font-extrabold text-white mb-4 leading-tight"
                >
                    Experience the <span className="text-gradient">Extraordinary</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg max-w-2xl"
                >
                    Discover and book the most exclusive tech events and conferences. Secure your spot in seconds with our high-speed booking engine.
                </motion.p>
            </header>

            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 backdrop-blur-md"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
                {success && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 backdrop-blur-md"
                    >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>{success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card group flex flex-col h-full relative overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all"></div>
                        
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                                Upcoming Event
                            </span>
                            <h3 className="text-2xl font-outfit font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {event.title}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                {event.description}
                            </p>
                        </div>

                        <div className="mt-auto space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 text-sm">
                                <Users className="w-4 h-4 text-primary" />
                                <span>{event.remaining_tickets} / {event.total_capacity} tickets left</span>
                            </div>
                        </div>

                        <div className="w-full h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(event.remaining_tickets / event.total_capacity) * 100}%` }}
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                            />
                        </div>

                        <button 
                            onClick={() => handleBook(event.id)}
                            disabled={bookingId === event.id || event.remaining_tickets === 0}
                            className="btn-primary w-full flex items-center justify-center gap-2 group/btn"
                        >
                            {bookingId === event.id ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : event.remaining_tickets === 0 ? (
                                'Sold Out'
                            ) : (
                                <>
                                    Book Your Ticket
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
