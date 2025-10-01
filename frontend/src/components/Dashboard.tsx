"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { RefreshCcw } from "lucide-react";

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // fetch new blockchain data here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 dark:from-gray-900 dark:to-gray-800">
      {/* Offline Mode Banner */}
      <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-800 p-3 mb-4 rounded">
        <span className="font-medium">Offline Mode</span> - Showing demo data.
        Reconnecting to blockchain…
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">System Status</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm">
              {Math.floor(
                (new Date().getTime() - lastUpdated.getTime()) / 1000
              )}
              s ago
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <RefreshCcw size={16} className="mr-1" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Latest Block */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Latest Block</h3>
          <p className="text-3xl font-bold">
            <CountUp end={24789123} separator="," duration={2} />
          </p>
          <span className="text-sm">42 transactions</span>
        </motion.div>

        {/* CELO Price */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-600 text-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">CELO Price</h3>
          <p className="text-3xl font-bold">$0.6800</p>
          <span className="text-sm">Market Cap: $680M</span>
        </motion.div>

        {/* Network Health */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Network Health</h3>
          <p className="text-3xl font-bold">98.5%</p>
          <span className="text-sm">Excellent</span>
        </motion.div>

        {/* Active Validators */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-orange-600 text-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Active Validators</h3>
          <p className="text-3xl font-bold">110</p>
          <span className="text-sm">Securing the network</span>
        </motion.div>
      </div>
    </div>
  );
}
