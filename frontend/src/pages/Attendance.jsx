import React, { useState, useEffect } from 'react';
import { eventService, attendanceService } from '../services/api';
import { UserCheck, QrCode, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Attendance = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [ticketCode, setTicketCode] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getUpcomingEvents();
                setEvents(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    const handleCheckIn = async (e) => {
        e.preventDefault();
        if (!selectedEventId || !ticketCode) return;
        
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const response = await attendanceService.markAttendance(selectedEventId, ticketCode);
            const data = response.data;
            setSuccess(`Entry confirmed! Under User ID ${data.userId} (${data.totalTicketsBooked} total ticket(s) booked). Marked at ${new Date(data.entryTime).toLocaleTimeString()}`);
            setHistory([{ eventId: selectedEventId, ticketCode, time: data.entryTime }, ...history]);
            setTicketCode(''); // Reset for next person
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <header className="mb-12">
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-outfit font-bold text-white mb-2"
                >
                    Staff <span className="text-gradient">Portal</span>
                </motion.h2>
                <p className="text-slate-400">Scan and verify guest ticket codes for entry.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sticky top-24">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card flex-grow h-fit"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <QrCode className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Manual Check-in</h3>
                    </div>

                    <form onSubmit={handleCheckIn} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Select Event</label>
                            <select 
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                            >
                                <option value="">Choose an active event...</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Ticket Code</label>
                            <input 
                                type="text"
                                value={ticketCode}
                                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                                placeholder="E.g. TKT-B4D-001..."
                                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || !selectedEventId || !ticketCode}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><UserCheck className="w-5 h-5" /> Confirm Entry</>}
                        </button>
                    </form>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-medium">{success}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 lowercase tracking-tighter">
                            <History className="w-5 h-5 text-primary" /> Session History
                        </h3>
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-widest">{history.length} Recent entries</span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {history.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 glass rounded-2xl border-dashed border-white/5 opacity-50 grayscale">
                              <History className="w-8 h-8 text-slate-600 mb-2" />
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">No activity in this session</p>
                          </div>
                        ) : history.map((entry, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card p-4 flex justify-between items-center bg-emerald-500/5 group"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Checked In</span>
                                    <span className="text-sm font-mono text-white group-hover:text-primary transition-colors">{entry.ticketCode}</span>
                                </div>
                                <span className="text-xs text-slate-500 bg-dark px-2 py-1 rounded border border-white/5 font-bold">{new Date(entry.time).toLocaleTimeString()}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
