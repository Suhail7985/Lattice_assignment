import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import { Ticket, Calendar, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userId = 1; // Simulated User ID
                const response = await bookingService.getUserBookings(userId);
                setBookings(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <header className="mb-12">
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-outfit font-bold text-white mb-2"
                >
                    Your <span className="text-gradient">Tickets</span>
                </motion.h2>
                <p className="text-slate-400">View and manage your digital event passes.</p>
            </header>

            {bookings.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ticket className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                    <p className="text-slate-400 mb-8">Ready to join your next tech event?</p>
                    <a href="/" className="btn-primary inline-flex items-center gap-2">Explore Events</a>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card flex flex-col md:flex-row gap-6 items-center overflow-hidden border-l-4 border-l-primary"
                        >
                            <div className="flex-shrink-0 w-full md:w-32 h-32 bg-white/5 rounded-xl flex items-center justify-center group overflow-hidden">
                                <QrCode className="w-16 h-16 text-slate-500 group-hover:text-primary transition-all group-hover:scale-110" />
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-xl font-bold text-white mb-1">{booking.event_title}</h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>{new Date(booking.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-primary" />
                                        <span className="font-mono text-[11px] bg-dark px-2 py-0.5 rounded border border-white/5">
                                            {booking.ticket_code}
                                        </span>
                                        <button 
                                            onClick={() => copyToClipboard(booking.ticket_code)}
                                            className="p-1 hover:bg-white/10 rounded transition-colors text-slate-500 hover:text-white"
                                        >
                                            {copied === booking.ticket_code ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-widest">
                                    Confirmed
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
