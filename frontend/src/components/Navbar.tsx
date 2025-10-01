"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { SystemStatus } from "../../lib/types";

interface NavbarProps {
  systemStatus?: SystemStatus;
  onSidebarToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ systemStatus, onSidebarToggle }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "AI Chat Assistant";
      case "/dashboard":
        return "Blockchain Dashboard";
      case "/risk-management":
        return "Risk Management";
      default:
        return "Celo Multi-Agent System";
    }
  };

  const getPageDescription = () => {
    switch (pathname) {
      case "/":
        return "Ask questions about Celo blockchain, get real-time data, or search the web";
      case "/dashboard":
        return "Monitor blockchain metrics and network status";
      case "/risk-management":
        return "Configure automated hedging and risk protection";
      default:
        return "AI-powered blockchain interactions";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Mobile menu + Logo and Page Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-celo-green to-celo-yellow rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-celo-black">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-celo-gray max-w-md">
                  {getPageDescription()}
                </p>
              </div>
            </div>
          </div>

          {/* Center section - Search (optional) */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-celo-green focus:border-transparent"
                placeholder="Search conversations, transactions..."
              />
            </div>
          </div>

          {/* Right section - Actions and Status */}
          <div className="flex items-center space-x-4">
            {/* System Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full">
                {systemStatus?.system_initialized ? (
                  <>
                    <div className="w-2 h-2 bg-celo-green rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-celo-black">
                      System Online
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-medium text-red-600">
                      Offline
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {/* Help */}
              <button className="p-2 text-gray-400 hover:text-celo-black rounded-lg hover:bg-gray-50 transition-colors">
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-celo-black rounded-lg hover:bg-gray-50 transition-colors relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-celo-green rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-celo-black rounded-lg hover:bg-gray-50 transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-celo-black rounded-lg hover:bg-gray-50 transition-colors">
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="hidden md:block text-sm font-medium">
                    User
                  </span>
                  <ChevronDownIcon className="hidden md:block w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile page title */}
      <div className="md:hidden px-4 pb-3">
        <h1 className="text-lg font-bold text-celo-black">{getPageTitle()}</h1>
        <p className="text-sm text-celo-gray">{getPageDescription()}</p>
      </div>
    </nav>
  );
};

export default Navbar;
