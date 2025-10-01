"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  SignalIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { SystemStatus } from "../../lib/types";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  systemStatus?: SystemStatus;
}

const Layout: React.FC<LayoutProps> = ({ children, systemStatus }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "AI Chat",
      href: "/",
      icon: ChatBubbleLeftRightIcon,
      description: "Chat with multi-agent system",
    },
    {
      name: "Blockchain Dashboard",
      href: "/dashboard",
      icon: ChartBarIcon,
      description: "Monitor Celo blockchain",
    },
    {
      name: "Risk Management",
      href: "/risk-management",
      icon: ShieldCheckIcon,
      description: "Configure auto-hedge settings",
    },
  ];

  const getStatusIcon = () => {
    if (!systemStatus)
      return <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />;
    return systemStatus.system_initialized ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusText = () => {
    if (!systemStatus) return "Unknown";
    return systemStatus.system_initialized ? "Online" : "Offline";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-celo-black">
              Celo Multi-Agent
            </h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <nav className="mt-4 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group mb-1 ${
                    isActive
                      ? "bg-celo-green text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-white lg:shadow-sm lg:flex lg:flex-col lg:border-r lg:border-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-celo-green to-celo-yellow rounded-lg flex items-center justify-center">
              <SignalIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-celo-black">Celo AI</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group mb-1 ${
                  isActive
                    ? "bg-celo-green text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium text-gray-900">System Status</div>
              <div className="flex items-center gap-2 text-gray-600">
                {getStatusIcon()}
                {getStatusText()}
              </div>
            </div>
            {systemStatus && (
              <div className="text-xs text-gray-500">
                {systemStatus.active_threads} active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <Navbar
          systemStatus={systemStatus}
          onSidebarToggle={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="min-h-screen bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
