// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RiskAgentHedge
 * @notice Smart contract for automated risk hedging on Celo DeFi
 * @dev Works with Ubeswap and allows AI agent to execute emergency exits
 */

interface IUbeswapRouter {
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract RiskAgentHedge {
    
    // ============================
    // STATE VARIABLES
    // ============================
    
    address public owner;
    address public aiAgent;
    
    // Testnet addresses
    address public constant UBESWAP_ROUTER = 0x7D28570135A2B1930F331c507F65039D4937f66c;
    address public constant cUSD = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address public constant CELO = 0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9;
    
    // User configurations
    mapping(address => UserConfig) public userConfigs;
    
    struct UserConfig {
        bool autoHedgeEnabled;
        uint8 maxSlippagePercent;  // e.g., 5 = 5%
        uint256 minValueUSD;       // Minimum value to hedge
        address preferredStable;   // cUSD, cEUR, etc.
        uint256 gasLimit;          // Max gas for execution
    }
    
    // Statistics
    uint256 public totalHedgesExecuted;
    uint256 public totalValueSaved;
    
    // ============================
    // EVENTS
    // ============================
    
    event AutoHedgeEnabled(address indexed user, address preferredStable);
    event AutoHedgeDisabled(address indexed user);
    event EmergencyHedgeExecuted(
        address indexed user,
        address indexed lpToken,
        uint256 liquidityRemoved,
        uint256 stableReceived,
        string reason
    );
    event AgentUpdated(address indexed oldAgent, address indexed newAgent);
    event ConfigUpdated(address indexed user);
    
    // ============================
    // MODIFIERS
    // ============================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAgent() {
        require(msg.sender == aiAgent, "Not authorized agent");
        _;
    }
    
    modifier onlyUserOrAgent(address user) {
        require(msg.sender == user || msg.sender == aiAgent, "Not authorized");
        _;
    }
    
    // ============================
    // CONSTRUCTOR
    // ============================
    
    constructor(address _aiAgent) {
        owner = msg.sender;
        aiAgent = _aiAgent;
    }
    
    // ============================
    // USER CONFIGURATION
    // ============================
    
    /**
     * @notice Enable auto-hedge protection
     * @param _maxSlippage Maximum acceptable slippage (1-10%)
     * @param _minValue Minimum position value to hedge (in USD)
     * @param _preferredStable Stable coin to swap to (cUSD recommended)
     */
    function enableAutoHedge(
        uint8 _maxSlippage,
        uint256 _minValue,
        address _preferredStable
    ) external {
        require(_maxSlippage <= 10, "Slippage too high");
        require(_maxSlippage >= 1, "Slippage too low");
        require(_minValue >= 10e18, "Min value too low"); // At least $10
        
        userConfigs[msg.sender] = UserConfig({
            autoHedgeEnabled: true,
            maxSlippagePercent: _maxSlippage,
            minValueUSD: _minValue,
            preferredStable: _preferredStable == address(0) ? cUSD : _preferredStable,
            gasLimit: 500000 // Default gas limit
        });
        
        emit AutoHedgeEnabled(msg.sender, _preferredStable);
    }
    
    /**
     * @notice Disable auto-hedge
     */
    function disableAutoHedge() external {
        userConfigs[msg.sender].autoHedgeEnabled = false;
        emit AutoHedgeDisabled(msg.sender);
    }
    
    /**
     * @notice Update configuration
     */
    function updateConfig(
        uint8 _maxSlippage,
        uint256 _minValue,
        address _preferredStable
    ) external {
        require(userConfigs[msg.sender].autoHedgeEnabled, "Auto-hedge not enabled");
        require(_maxSlippage <= 10 && _maxSlippage >= 1, "Invalid slippage");
        
        UserConfig storage config = userConfigs[msg.sender];
        config.maxSlippagePercent = _maxSlippage;
        config.minValueUSD = _minValue;
        config.preferredStable = _preferredStable;
        
        emit ConfigUpdated(msg.sender);
    }
    
    // ============================
    // CORE HEDGE FUNCTIONS
    // ============================
    
    /**
     * @notice Execute emergency hedge (called by AI agent)
     * @param user User whose position to hedge
     * @param lpToken LP token address
     * @param tokenA First token in pair
     * @param tokenB Second token in pair
     * @param liquidityAmount Amount of LP tokens
     * @param riskReason Why we're hedging
     */
    function executeEmergencyHedge(
        address user,
        address lpToken,
        address tokenA,
        address tokenB,
        uint256 liquidityAmount,
        string calldata riskReason
    ) external onlyAgent returns (uint256 stableReceived) {
        UserConfig memory config = userConfigs[user];
        require(config.autoHedgeEnabled, "Auto-hedge not enabled");
        
        // Transfer LP tokens from user
        require(
            IERC20(lpToken).transferFrom(user, address(this), liquidityAmount),
            "LP transfer failed"
        );
        
        // Approve router
        IERC20(lpToken).approve(UBESWAP_ROUTER, liquidityAmount);
        
        // Remove liquidity
        (uint256 amountA, uint256 amountB) = IUbeswapRouter(UBESWAP_ROUTER).removeLiquidity(
            tokenA,
            tokenB,
            liquidityAmount,
            0, // Min amounts handled in swap
            0,
            address(this),
            block.timestamp + 300
        );
        
        // Swap both tokens to stable
        uint256 stableFromA = _swapToStable(tokenA, amountA, config);
        uint256 stableFromB = _swapToStable(tokenB, amountB, config);
        
        stableReceived = stableFromA + stableFromB;
        
        // Verify minimum value
        require(stableReceived >= config.minValueUSD, "Value below minimum");
        
        // Transfer stable to user
        require(
            IERC20(config.preferredStable).transfer(user, stableReceived),
            "Stable transfer failed"
        );
        
        // Update stats
        totalHedgesExecuted++;
        totalValueSaved += stableReceived;
        
        emit EmergencyHedgeExecuted(user, lpToken, liquidityAmount, stableReceived, riskReason);
        
        return stableReceived;
    }
    
    /**
     * @notice Quick hedge - user-initiated emergency exit
     * @param lpToken LP token to exit
     * @param amount Amount to exit
     */
    function quickHedge(
        address lpToken,
        address tokenA,
        address tokenB,
        uint256 amount
    ) external returns (uint256 stableReceived) {
        UserConfig memory config = userConfigs[msg.sender];
        require(config.autoHedgeEnabled, "Auto-hedge not enabled");
        
        // Transfer LP tokens
        require(
            IERC20(lpToken).transferFrom(msg.sender, address(this), amount),
            "LP transfer failed"
        );
        
        // Approve and remove liquidity
        IERC20(lpToken).approve(UBESWAP_ROUTER, amount);
        
        (uint256 amountA, uint256 amountB) = IUbeswapRouter(UBESWAP_ROUTER).removeLiquidity(
            tokenA,
            tokenB,
            amount,
            0,
            0,
            address(this),
            block.timestamp + 300
        );
        
        // Swap to stable
        uint256 stableFromA = _swapToStable(tokenA, amountA, config);
        uint256 stableFromB = _swapToStable(tokenB, amountB, config);
        
        stableReceived = stableFromA + stableFromB;
        
        // Transfer to user
        IERC20(config.preferredStable).transfer(msg.sender, stableReceived);
        
        emit EmergencyHedgeExecuted(msg.sender, lpToken, amount, stableReceived, "User initiated");
        
        return stableReceived;
    }
    
    // ============================
    // INTERNAL FUNCTIONS
    // ============================
    
    function _swapToStable(
        address token,
        uint256 amount,
        UserConfig memory config
    ) internal returns (uint256) {
        // If already stable, no swap needed
        if (token == config.preferredStable) {
            return amount;
        }
        
        // Approve router
        IERC20(token).approve(UBESWAP_ROUTER, amount);
        
        // Build path
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = config.preferredStable;
        
        // Calculate minimum output with slippage
        uint256 minOut = (amount * (100 - config.maxSlippagePercent)) / 100;
        
        // Execute swap
        uint[] memory amounts = IUbeswapRouter(UBESWAP_ROUTER).swapExactTokensForTokens(
            amount,
            minOut,
            path,
            address(this),
            block.timestamp + 300
        );
        
        return amounts[amounts.length - 1];
    }
    
    // ============================
    // ADMIN FUNCTIONS
    // ============================
    
    function updateAIAgent(address newAgent) external onlyOwner {
        require(newAgent != address(0), "Invalid address");
        address oldAgent = aiAgent;
        aiAgent = newAgent;
        emit AgentUpdated(oldAgent, newAgent);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
    
    // ============================
    // VIEW FUNCTIONS
    // ============================
    
    function getUserConfig(address user) external view returns (UserConfig memory) {
        return userConfigs[user];
    }
    
    function isAutoHedgeEnabled(address user) external view returns (bool) {
        return userConfigs[user].autoHedgeEnabled;
    }
    
    function getStats() external view returns (uint256 hedges, uint256 valueSaved) {
        return (totalHedgesExecuted, totalValueSaved);
    }
}