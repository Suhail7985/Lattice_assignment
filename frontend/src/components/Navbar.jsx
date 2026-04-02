import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Ticket, UserCheck, Layout } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Events', path: '/', icon: Calendar },
    { name: 'My Bookings', path: '/bookings', icon: Ticket },
    { name: 'Staff Check-in', path: '/attendance', icon: UserCheck },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Layout className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-outfit font-bold tracking-tight text-white uppercase tracking-widest">
            Event<span className="text-primary">Pro</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-all hover:text-white ${
                location.pathname === item.path ? 'text-white' : 'text-slate-400'
              }`}
            >
              <item.icon className={`w-4 h-4 ${location.pathname === item.path ? 'text-primary' : ''}`} />
              {item.name}
              {location.pathname === item.path && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary animate-pulse" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Simulated User</span>
            <span className="text-xs text-white font-medium">John Doe (ID: 1)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/20">
            JD
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
