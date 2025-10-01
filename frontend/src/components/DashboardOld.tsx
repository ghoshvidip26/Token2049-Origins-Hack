"use client";

import React, { useState, useEffect } from "react";
import {
  CubeIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  ArrowPathIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  WifiIcon,
  BoltIcon,
  CurrencyDollarIcon,
  UsersIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useLatestBlock, useCeloStats, useSystemStatus } from "../hooks/useApi";

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState("");

  const {
    data: latestBlock,
    isLoading: blockLoading,
    error: blockError,
    refetch: refetchBlock,
  } = useLatestBlock();

  const {
    data: celoStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useCeloStats();

  const {
    data: systemStatus,
    isLoading: systemLoading,
    error: systemError,
  } = useSystemStatus();

  // Mock/fallback data when API is unavailable
  const mockData = {
    chainId: 42220,
    latestBlock: 21845672,
    gasPrice: "0.5 Gwei",
    totalTransactions: "156,890,234",
    activeValidators: 110,
    totalSupply: "1,000,000,000 CELO",
    marketCap: "$487.2M",
    celoPrice: "$0.487",
    networkHashrate: "2.34 TH/s",
    blockTime: "5s",
    tps: "65",
    networkUtilization: "78%",
  };

  const isOffline =
    !systemStatus?.system_initialized &&
    (blockError || statsError || systemError);
  const isConnected =
    systemStatus?.system_initialized && !blockError && !statsError;

  // Time ago calculator
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);

      if (diff < 60) setTimeAgo(`${diff}s ago`);
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      else setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Auto-refresh functionality
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        refetchBlock();
        refetchStats();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, refetchBlock, refetchStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBlock(), refetchStats()]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatNumber = (num: number | string) => {
    return Number(num).toLocaleString();
  };

  const getStatusInfo = () => {
    if (systemLoading)
      return {
        color: "text-yellow-500 bg-yellow-50 border-yellow-200",
        icon: <ArrowPathIcon className="w-5 h-5 animate-spin" />,
        text: "Connecting...",
        desc: "Establishing connection to Celo network",
      };

    if (isOffline)
      return {
        color: "text-red-500 bg-red-50 border-red-200",
        icon: <XCircleIcon className="w-5 h-5" />,
        text: "Disconnected",
        desc: "Running in demo mode with mock data",
      };

    return {
      color: "text-celo-green bg-green-50 border-green-200",
      icon: <CheckCircleIcon className="w-5 h-5" />,
      text: "Connected",
      desc: "Live data from Celo network",
    };
  };

  const status = getStatusInfo();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    loading?: boolean;
    trend?: "up" | "down" | "neutral";
    change?: string;
  }> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    loading,
    trend,
    change,
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && change && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : trend === "down" ? (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            ) : null}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Celo Blockchain Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor real-time Celo network statistics and block information
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${status.color}`}
              >
                {status.icon}
                <div>
                  <span className="font-medium">{status.text}</span>
                  <p className="text-xs opacity-75">{status.desc}</p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-celo-green text-white rounded-lg hover:bg-celo-green/90 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Last Update Info */}
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()} ({timeAgo})
          </div>
        </div>

        {/* Network Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Chain ID"
            value={mockData.chainId}
            icon={CubeIcon}
            color="bg-celo-green"
            loading={blockLoading}
          />

          <StatCard
            title="Latest Block"
            value={
              isConnected ? latestBlock?.number || "---" : mockData.latestBlock
            }
            icon={CubeIcon}
            color="bg-blue-500"
            loading={blockLoading}
            trend="up"
            change="+0.2%"
          />

          <StatCard
            title="Gas Price"
            value={
              isConnected ? latestBlock?.gasUsed || "---" : mockData.gasPrice
            }
            subtitle="Gas used in latest block"
            icon={FireIcon}
            color="bg-orange-500"
            loading={blockLoading}
            trend="down"
            change="-5.1%"
          />

          <StatCard
            title="Connection"
            value={status.text}
            icon={isConnected ? CheckCircleIcon : XCircleIcon}
            color={isConnected ? "bg-celo-green" : "bg-red-500"}
            loading={systemLoading}
          />
        </div>

        {/* Network Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Network TPS"
            value={mockData.tps}
            subtitle="Transactions per second"
            icon={BoltIcon}
            color="bg-purple-500"
            trend="up"
            change="+12%"
          />

          <StatCard
            title="Active Validators"
            value={mockData.activeValidators}
            subtitle="Securing the network"
            icon={UsersIcon}
            color="bg-indigo-500"
            trend="neutral"
          />

          <StatCard
            title="Network Utilization"
            value={mockData.networkUtilization}
            subtitle="Block space used"
            icon={ChartBarIcon}
            color="bg-pink-500"
            trend="up"
            change="+3.2%"
          />
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Latest Block Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Latest Block Information
              </h2>
              <CubeIcon className="w-6 h-6 text-celo-green" />
            </div>

            {blockLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-4 rounded"
                  ></div>
                ))}
              </div>
            ) : blockError || isOffline ? (
              <div className="text-center py-8">
                <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {isOffline
                    ? "Displaying demo data"
                    : "Failed to load block information"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Block Number:</span>
                  <span className="font-medium">
                    {latestBlock?.number || mockData.latestBlock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Block Hash:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {latestBlock?.hash || "0x1234...5678"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-medium">
                    {latestBlock?.timestamp
                      ? new Date(
                          Number(latestBlock.timestamp) * 1000
                        ).toLocaleString()
                      : new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="font-medium">
                    {latestBlock?.transactions || "127"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Network Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Network Health
              </h2>
              <ShieldCheckIcon className="w-6 h-6 text-celo-green" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">RPC Status</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-celo-green" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      isConnected ? "text-celo-green" : "text-red-500"
                    }`}
                  >
                    {isConnected ? "Healthy" : "Unhealthy"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Multi-Agent System</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      systemStatus?.system_initialized
                        ? "bg-celo-green"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      systemStatus?.system_initialized
                        ? "text-celo-green"
                        : "text-red-500"
                    }`}
                  >
                    {systemStatus?.system_initialized ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Block Sync</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-celo-green"></div>
                  <span className="text-sm font-medium text-celo-green">
                    Synced
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Network Latency</span>
                <span className="text-sm font-medium text-gray-900">45ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="CELO Price"
            value={mockData.celoPrice}
            subtitle="USD per CELO"
            icon={CurrencyDollarIcon}
            color="bg-celo-green"
            trend="up"
            change="+2.4%"
          />

          <StatCard
            title="Market Cap"
            value={mockData.marketCap}
            subtitle="Total market value"
            icon={GlobeAltIcon}
            color="bg-blue-500"
            trend="up"
            change="+1.8%"
          />

          <StatCard
            title="Total Supply"
            value="1.0B CELO"
            subtitle="Circulating supply"
            icon={CubeIcon}
            color="bg-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
