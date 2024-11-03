"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Wallet, Users, Search, MapPin } from 'lucide-react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample events data - in production this would come from your API/blockchain
  const events = [
    {
      id: 1,
      name: "Ethereum Developer Meetup",
      date: "2024-12-01",
      time: "18:00",
      location: "San Francisco, CA",
      price: "0.05",
      maxAttendees: 100,
      currentAttendees: 45,
      description: "Join us for an evening of Ethereum development talks and networking."
    },
    {
      id: 2,
      name: "Web3 Conference 2024",
      date: "2024-12-15",
      time: "09:00",
      location: "New York, NY",
      price: "0.1",
      maxAttendees: 500,
      currentAttendees: 123,
      description: "A full-day conference covering the latest in Web3 technology and blockchain development."
    }
  ];

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Explore Events</h1>
                <p className="text-gray-400">Discover blockchain-powered events near you</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium"
                onClick={() => window.location.href = '/create-event'}
              >
                Create Event
              </motion.button>
            </div>

            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search events by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#222] border border-gray-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#222] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{event.name}</h2>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-400">
                        <Clock className="w-5 h-5" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-400">
                        <Wallet className="w-5 h-5" />
                        <span>{event.price} AIA</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-400">
                        <Users className="w-5 h-5" />
                        <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-6 line-clamp-2">{event.description}</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#333] hover:bg-[#444] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No events found matching your search.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;