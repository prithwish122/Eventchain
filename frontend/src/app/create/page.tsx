"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Wallet, Users, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BrowserProvider, ethers } from 'ethers';
import ContractABI from "../contractsData/ContractABI.json"



declare global {
    interface Window {
      ethereum?: any; // Declare the ethereum object
    }
  }


const CreateEventPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    price: '',
    maxAttendees: '',
    description: '',
    location: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Handle navigation after successful submission
  useEffect(() => {
    if (shouldNavigate) {
      router.push('/events');
    }
  }, [shouldNavigate, router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
        const claimAmt = 1;
        const contractAddress = "0xaF91afD9420c7947ed8D5c8D14899F417eC39D7b"
        const provider = new BrowserProvider(window.ethereum);
    
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Wallet Address:", address);
        const humorTokenContract = new ethers.Contract(contractAddress, ContractABI.abi, signer)
        // mint();
        console.log(claimAmt, "========inside withdraw===")
    
        await (await humorTokenContract.donate(address,"0x94A7Af5edB47c3B91d1B4Ffc2CA535d7aDA8CEDe" ,ethers.parseUnits(claimAmt.toString(), 18))).wait();
        alert("Event Created Successfully!!")
    
      
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        date: '',
        time: '',
        price: '',
        maxAttendees: '',
        description: '',
        location: '',
      });
      
      // Trigger navigation after showing success message
      setTimeout(() => {
        setShowSuccess(false);
        setShouldNavigate(true);
      }, 1500);
      
    } catch (error) {
      setIsSubmitting(false);
      // Handle error state here if needed
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Create Event</h1>
            <p className="text-gray-400 mb-8">Launch your next event on the blockchain</p>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <p className="text-green-500">
                  Event created successfully! Redirecting to events page...
                </p>
              </div>
            )}

            <div className="bg-[#222] border border-gray-800 rounded-xl mb-6">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2 text-blue-500">
                  <Calendar className="w-5 h-5" />
                  <h2 className="text-xl font-semibold text-white">Event Details</h2>
                </div>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rest of the form fields remain the same */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Event Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          required
                        />
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          required
                        />
                        <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Price (AIA)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          step="0.001"
                          min="0"
                          className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <Wallet className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Max Attendees
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="maxAttendees"
                          value={formData.maxAttendees}
                          onChange={handleChange}
                          min="1"
                          className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <Users className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>

            <div className="bg-[#222] border border-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  Your event will be created on the AIA chain. Make sure you have enough AIA in your wallet to cover the gas fees. After creation, your event will be visible on the explore page.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEventPage;