import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import Attendance from './pages/Attendance';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-[#030712] selection:bg-primary/30 selection:text-primary">
      <Navbar />
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="pt-24 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </main>

      <footer className="py-12 border-t border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-outfit font-bold text-white uppercase tracking-widest">
              Event<span className="text-primary">Pro</span>
            </span>
            <span className="text-slate-500 text-sm hidden md:inline border-l border-white/10 pl-4">© 2026 Next-Gen Events Inc.</span>
          </div>
          
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>

          <div className="text-slate-500 text-[10px] items-end text-right">
              <p>Senior Backend Engineer Submission</p>
              <p className="font-mono text-primary/50">Version 1.0.4 - Production Grade</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
