"use client";

import { useState, useMemo } from 'react';
import { 
  ShieldCheckIcon, 
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  WalletIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
// Mock hooks for demonstration - replace with actual API hooks
const useWalletBalance = (address: string) => ({ data: null, isError: true });
const usePortfolioData = (address: string) => ({ data: null, isError: true });
const useRiskMetrics = (address: string) => ({ data: null, isError: true });

interface WalletConnection {
  address: string;
  name: string;
  balance: number;
  network: string;
  isConnected: boolean;
  lastUpdate: string;
}

interface RiskAlert {
  id: string;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  isAcknowledged: boolean;
}

interface PortfolioPosition {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  allocation: number;
  risk: 'low' | 'medium' | 'high';
}

export default function RiskManagement() {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [showBalances, setShowBalances] = useState<boolean>(false);
  const [riskThreshold, setRiskThreshold] = useState<number>(70);

  // Mock data with offline fallbacks
  const mockWallets: WalletConnection[] = [
    {
      address: '0x742d35Cc6635C0532925a3b8D...',
      name: 'Main Wallet',
      balance: 125.34,
      network: 'Celo Mainnet',
      isConnected: true,
      lastUpdate: new Date().toISOString()
    },
    {
      address: '0x8f9E2b4A7c1D3e5F6a8B9c0D...',
      name: 'Trading Wallet', 
      balance: 67.89,
      network: 'Celo Alfajores',
      isConnected: false,
      lastUpdate: '2024-01-15T10:30:00Z'
    }
  ];

  const mockAlerts: RiskAlert[] = [
    {
      id: '1',
      type: 'high',
      title: 'High Volatility Detected',
      description: 'CELO price volatility exceeds 15% in the last hour',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isAcknowledged: false
    },
    {
      id: '2',
      type: 'medium',
      title: 'Portfolio Imbalance',
      description: 'Single asset represents >70% of portfolio value',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isAcknowledged: false
    },
    {
      id: '3',
      type: 'low',
      title: 'Network Congestion',
      description: 'Celo network experiencing higher than normal gas fees',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isAcknowledged: true
    }
  ];

  const mockPositions: PortfolioPosition[] = [
    {
      symbol: 'CELO',
      name: 'Celo',
      amount: 850.5,
      value: 425.25,
      change24h: 5.7,
      allocation: 65.2,
      risk: 'medium'
    },
    {
      symbol: 'cUSD',
      name: 'Celo Dollar',
      amount: 180.0,
      value: 180.0,
      change24h: 0.1,
      allocation: 27.6,
      risk: 'low'
    },
    {
      symbol: 'cEUR',
      name: 'Celo Euro',
      amount: 35.2,
      value: 37.8,
      change24h: -0.8,
      allocation: 5.8,
      risk: 'low'
    }
  ];

  // Hooks with mock fallbacks
  const { data: walletBalance, isError: balanceError } = useWalletBalance(selectedWallet);
  const { data: portfolio, isError: portfolioError } = usePortfolioData(selectedWallet);
  const { data: riskMetrics, isError: metricsError } = useRiskMetrics(selectedWallet);

  // Use mock data when offline or error
  const wallets = mockWallets;
  const alerts = mockAlerts.filter((alert: RiskAlert) => !alert.isAcknowledged);
  const positions: PortfolioPosition[] = mockPositions; // Always use mock data for demo
  
  const totalPortfolioValue = positions.reduce((sum: number, pos: PortfolioPosition) => sum + pos.value, 0);
  const portfolioChange24h = positions.reduce((sum: number, pos: PortfolioPosition) => sum + (pos.value * pos.change24h / 100), 0);
  
  const riskScore = Math.round((positions.filter((p: PortfolioPosition) => p.risk === 'high').length * 30 +
                positions.filter((p: PortfolioPosition) => p.risk === 'medium').length * 15 +
                positions.filter((p: PortfolioPosition) => p.risk === 'low').length * 5));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'medium': return <ShieldExclamationIcon className="w-5 h-5 text-yellow-500" />;
      case 'low': return <ShieldCheckIcon className="w-5 h-5 text-blue-500" />;
      default: return <ShieldCheckIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
          <p className="text-gray-600">Monitor and manage your portfolio risks</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Cog6ToothIcon className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Wallet
          </button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${riskScore > 70 ? 'bg-red-100' : riskScore > 40 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                {riskScore > 70 ? (
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                ) : riskScore > 40 ? (
                  <ShieldExclamationIcon className="w-6 h-6 text-yellow-600" />
                ) : (
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Risk Score</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{riskScore}/100</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${riskScore > 70 ? 'text-red-600' : riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Portfolio Value</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  ${showBalances ? totalPortfolioValue.toFixed(2) : '••••••'}
                </p>
                <button
                  onClick={() => setShowBalances(!showBalances)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  {showBalances ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${portfolioChange24h >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {portfolioChange24h >= 0 ? (
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">24h Change</p>
              <div className="flex items-baseline">
                <p className={`text-2xl font-semibold ${portfolioChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioChange24h >= 0 ? '+' : ''}${portfolioChange24h.toFixed(2)}
                </p>
                <p className={`ml-2 text-sm font-medium ${portfolioChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({((portfolioChange24h / totalPortfolioValue) * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${alerts.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {alerts.length > 0 ? (
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
                <p className="ml-2 text-sm font-medium text-gray-500">
                  {alerts.length === 0 ? 'All clear' : 'Need attention'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Connections */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Connected Wallets</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your wallet connections</p>
          </div>
          <div className="p-6 space-y-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.address}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedWallet === wallet.address
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedWallet(wallet.address)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <WalletIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{wallet.name}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${wallet.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <p className="text-sm text-gray-500 font-mono mb-2">
                  {wallet.address}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <GlobeAltIcon className="w-4 h-4 mr-1" />
                    {wallet.network}
                  </div>
                  <div className="font-medium text-gray-900">
                    {showBalances ? `${wallet.balance} CELO` : '••••••'}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-400 mt-2">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Last update: {new Date(wallet.lastUpdate).toLocaleString()}
                </div>
              </div>
            ))}

            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
              <PlusIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Connect New Wallet</span>
            </button>
          </div>
        </div>

        {/* Portfolio Positions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Portfolio Positions</h3>
                <p className="mt-1 text-sm text-gray-500">Asset allocation and risk</p>
              </div>
              <ChartBarIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {positions.map((position: PortfolioPosition) => (
                <div key={position.symbol} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">{position.symbol}</span>
                        <span className="ml-2 text-sm text-gray-500">{position.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(position.risk)}`}>
                        {position.risk}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500">{position.amount.toFixed(2)} tokens</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">
                          ${showBalances ? position.value.toFixed(2) : '••••••'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${position.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.change24h >= 0 ? '+' : ''}{position.change24h.toFixed(2)}%
                        </div>
                        <div className="text-gray-500 text-xs">
                          {position.allocation.toFixed(1)}% allocation
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${position.allocation}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Risk Alerts</h3>
            <p className="mt-1 text-sm text-gray-500">Active risk notifications</p>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h4>
                <p className="text-gray-500">No active risk alerts at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border-l-4 rounded-r-lg ${
                      alert.type === 'high'
                        ? 'border-red-400 bg-red-50'
                        : alert.type === 'medium'
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-blue-400 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Risk Management Settings</h3>
          <p className="mt-1 text-sm text-gray-500">Configure risk thresholds and alerts</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="risk-threshold" className="block text-sm font-medium text-gray-700 mb-2">
                Risk Alert Threshold
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="risk-threshold"
                  min="0"
                  max="100"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 w-12">{riskThreshold}%</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Get alerts when portfolio risk exceeds this threshold
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-900">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-900">Browser notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-900">SMS alerts (high risk only)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {(balanceError || portfolioError || metricsError) && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Offline Mode - Showing demo data</span>
          </div>
        </div>
      )}
    </div>
  );
}