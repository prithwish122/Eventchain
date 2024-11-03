'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Ticket, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';

// Types
type NavItem = {
  label: string;
  href: string;
};

type FeatureMetric = {
  value: string;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
};

type Event = {
  name: string;
  date: string;
  price: number;
  attendees: number;
  status: 'Active' | 'Upcoming' | 'Ended';
};

interface PhoneMockupProps {
  events: Event[];
  walletBalance: number;
  userName: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Events', href: '#events' },
  { label: 'Community', href: '#community' },
];

const metrics: FeatureMetric[] = [
  { value: '50K+', label: 'Events Created', suffix: '', icon: <Calendar className="w-6 h-6 text-blue-500" /> },
  { value: '2M+', label: 'Tickets Sold', suffix: '', icon: <Ticket className="w-6 h-6 text-orange-500" /> },
  { value: '0.001', label: 'Average Gas Fee', suffix: 'AIA', icon: null},
];

const sampleEvents: Event[] = [
  { name: 'ETH Global London', date: '2024 Mar 15', price: 0.1, attendees: 500, status: 'Upcoming' },
  { name: 'Web3 Summit', date: '2024 Mar 22', price: 0.15, attendees: 300, status: 'Active' },
  { name: 'DeFi Conference', date: '2024 Apr 05', price: 0.08, attendees: 250, status: 'Upcoming' },
];

const PhoneMockup: React.FC<PhoneMockupProps> = ({ events, walletBalance, userName }) => (
  <div className="relative w-[380px] h-[780px] bg-black rounded-[45px] p-6 shadow-2xl">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-[20px]" />
    <div className="bg-[#111] rounded-[35px] h-full p-5 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400">Welcome,</p>
          <p className="text-xl font-semibold">{userName} 🎪</p>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          <span>{walletBalance} AIA</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm mb-2">Your Next Event</p>
            <p className="text-2xl font-bold">ETH Global London</p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <p className="text-sm">Organizer</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Clock className="w-4 h-4" />
          <p className="text-sm">March 15, 2024</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-600 p-4 rounded-2xl text-center">Create</div>
        <div className="bg-orange-500 p-4 rounded-2xl text-center">Manage</div>
        <div className="bg-purple-600 p-4 rounded-2xl text-center">Tickets</div>
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <p className="font-medium">Upcoming Events</p>
          <p className="text-gray-400">View all</p>
        </div>
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between mb-4 bg-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-gray-400">{event.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-500">{event.price} AIA</p>
              <p className="text-sm text-gray-400">{event.attendees} attendees</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Page = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="relative flex justify-between items-center py-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold"
          >
            eventchain
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
            <Link href="/create">
            <motion.button
              whileHover={{ y: -2 }}
              className="bg-blue-500 text-white px-4 py-1 rounded-full"
            >
              Create Event
            </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-16 6h16"}
              />
            </svg>
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full right-0 left-0 bg-[#111] border border-gray-800 rounded-lg py-4 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
              <button className="w-full text-left px-4 py-2 text-blue-500 hover:bg-white/5">
                Create Event
              </button>
            </motion.div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 py-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
              <span className="text-blue-500">Create</span> and<br />
              <span className="text-orange-500">manage</span> events<br />
              on the <span className="text-purple-500">blockchain</span>.
              <motion.div
                className="absolute w-32 h-1 bg-gray-800"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </h1>
            <p className="text-gray-400 mb-8 text-lg">
              Launch your next event with smart contracts.<br />
              Secure, transparent, and decentralized ticketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#222] rounded-full px-6 py-3 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium"
              >
                Launch Event
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
              {metrics.map((metric, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-3">{metric.icon}</div>
                  <p className="text-2xl font-bold mb-2">
                    {metric.value}
                    {metric.suffix && <span className="text-gray-400 text-lg ml-1">{metric.suffix}</span>}
                  </p>
                  <p className="text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
            <PhoneMockup
              events={sampleEvents}
              walletBalance={1.245}
              userName="Alex"
            />
            
            {/* Floating elements */}
            <motion.div
              className="absolute -top-10 right-0 bg-white/10 backdrop-blur-lg rounded-2xl p-4 w-48"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-gray-400">Current Attendees</p>
              </div>
              <p className="text-xl font-bold">1,856</p>
              <p className="text-sm text-green-400">+23% this week</p>
            </motion.div>

            <motion.div
              className="absolute -bottom-10 -left-20 bg-white/10 backdrop-blur-lg rounded-2xl p-4 w-48"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {/* <ChainLink className="w-4 h-4 text-purple-500" /> */}
                <p className="text-sm text-gray-400">Network Status</p>
              </div>
              <div className="h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg opacity-50" />
              <p className="text-sm text-gray-400 mt-2">Ethereum Mainnet</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;