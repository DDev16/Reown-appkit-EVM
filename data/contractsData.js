// This file contains the source code for the contracts

export const ERC20ContractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract TokenStorageV1 is Initializable {
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant MAX_TOTAL_BURN = INITIAL_SUPPLY / 10; // 10% of initial supply
    uint256 public constant BURN_RATE_PRECISION = 100000; // Precision for burn rate calculations

    uint16 internal _burnRate;
    uint256 internal _totalBurned;
    bool internal _initialized;
    
    uint256[47] private __gap;
}

contract ERC20 is 
    TokenStorageV1,
    ERC20Upgradeable, 
    ERC20PausableUpgradeable,
    OwnableUpgradeable, 
    UUPSUpgradeable 
{
    // Events
    event BurnRateUpdated(uint16 oldRate, uint16 newRate);
    event AutoBurnExecuted(address from, address to, uint256 burnAmount);
    event MaxBurnLimitReached();
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner
    ) initializer public {
        require(!_initialized, "Contract already initialized");
        
        __ERC20_init("", "");
        __ERC20Pausable_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        
        _burnRate = 1; // Set to 0.001%
        _totalBurned = 0;
        
        // Mint entire supply to initial owner
        _mint(initialOwner, INITIAL_SUPPLY);
        _initialized = true;
    }

    // View Functions
    function burnRate() public view virtual returns (uint16) {
        return _burnRate;
    }

    function totalBurned() public view virtual returns (uint256) {
        return _totalBurned;
    }

    function remainingBurnAllowance() public view virtual returns (uint256) {
        if (_totalBurned >= MAX_TOTAL_BURN) {
            return 0;
        }
        return MAX_TOTAL_BURN - _totalBurned;
    }

    // Admin Functions
    function setBurnRate(uint16 newRate) external virtual onlyOwner {
        uint16 oldRate = _burnRate;
        _burnRate = newRate;
        emit BurnRateUpdated(oldRate, newRate);
    }

    function pause() external virtual onlyOwner {
        _pause();
    }

    function unpause() external virtual onlyOwner {
        _unpause();
    }

    // Internal Functions
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        // Prevent new minting after initialization
        if (from == address(0) && _initialized) {
            revert("Minting is not allowed after initialization");
        }

        if (from != address(0) && to != address(0)) {
            // Only proceed with burn if we haven't reached the maximum
            if (_totalBurned < MAX_TOTAL_BURN) {
                // Calculate potential burn amount (0.001% = multiply by 1 then divide by BURN_RATE_PRECISION)
                uint256 burnAmount = (amount * _burnRate) / BURN_RATE_PRECISION;
                
                // Adjust burn amount if it would exceed max total burn
                if (_totalBurned + burnAmount > MAX_TOTAL_BURN) {
                    burnAmount = MAX_TOTAL_BURN - _totalBurned;
                }
                
                if (burnAmount > 0) {
                    // Reduce the transfer amount by burn amount
                    uint256 transferAmount = amount - burnAmount;
                    
                    // Update total burned before transfers
                    _totalBurned += burnAmount;
                    
                    // First do the burn transfer
                    super._update(from, address(0), burnAmount);
                    
                    // Then do the main transfer with reduced amount
                    super._update(from, to, transferAmount);
                    
                    // Emit auto burn event
                    emit AutoBurnExecuted(from, to, burnAmount);
                    
                    // Emit event if we've reached the max burn limit
                    if (_totalBurned >= MAX_TOTAL_BURN) {
                        emit MaxBurnLimitReached();
                    }
                    
                    // Skip the default update since we handled it
                    return;
                }
            }
        }
        
        // For all other cases (no burn needed), use the default implementation
        super._update(from, to, amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     */
    uint256[47] private __gap;
}`;

export const AirdropContractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Multisender is Initializable, PausableUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Mapping to track total rewards received by each address in Flare
    mapping(address => uint256) private flareRewardsReceived;
    
    // Mapping to track total rewards received by each address in specific ERC20 tokens
    mapping(address => mapping(address => uint256)) private tokenRewardsReceived;

    // Event declarations
    event FlareAirdropped(address indexed recipient, uint256 amount);
    event TokenAirdropped(address indexed recipient, address indexed token, uint256 amount);
    event FlareWithdrawn(address indexed user, uint256 amount);
    event TokenWithdrawn(address indexed user, address indexed token, uint256 amount);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event FlareDeposited(address indexed from, uint256 amount);

    function initialize(address initialOwner) public initializer {
    require(initialOwner != address(0), "Invalid owner address");
    __Pausable_init();
    __Ownable_init(initialOwner);
    __ReentrancyGuard_init();
    __UUPSUpgradeable_init();
}


    /// @notice Pauses all multisend functions; only callable by owner
    function pause() public onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /// @notice Unpauses all multisend functions; only callable by owner
    function unpause() public onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    /// @notice Authorize contract upgrades; only callable by owner
    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

    /// @notice Airdrops specified ERC20 tokens to multiple recipients
    /// @param token The address of the ERC20 token to airdrop
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of token amounts for each recipient
    function multisendToken(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner nonReentrant whenNotPaused {
        require(recipients.length == amounts.length, "Mismatched recipients and amounts");

        IERC20Upgradeable erc20 = IERC20Upgradeable(token);
        uint256 totalAmount = 0;
        
        // Calculate the total amount to be sent
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        // Ensure allowance and balance cover the totalAmount
        require(erc20.allowance(msg.sender, address(this)) >= totalAmount, "Insufficient allowance for transfer");
        require(erc20.balanceOf(msg.sender) >= totalAmount, "Insufficient balance for transfer");

        // Distribute tokens
        for (uint256 i = 0; i < recipients.length; i++) {
            erc20.safeTransferFrom(msg.sender, recipients[i], amounts[i]);
            tokenRewardsReceived[recipients[i]][token] += amounts[i]; // Track the rewards received
            emit TokenAirdropped(recipients[i], token, amounts[i]);
        }
    }

    /// @notice Airdrops Flare (ETH) to multiple recipients
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of Flare amounts for each recipient
    function multisendFlare(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable onlyOwner nonReentrant whenNotPaused {
        require(recipients.length == amounts.length, "Mismatched recipients and amounts");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalAmount <= address(this).balance, "Insufficient Flare balance");

        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Flare transfer failed");
            flareRewardsReceived[recipients[i]] += amounts[i]; // Track the Flare rewards received
            emit FlareAirdropped(recipients[i], amounts[i]);
        }
    }

   /// @notice Withdraws all leftover Flare from the contract
    function withdrawFlare() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Flare balance to withdraw");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Flare withdrawal failed");

        emit FlareWithdrawn(msg.sender, balance);
    }

    /// @notice Withdraws all leftover ERC20 tokens from the contract
    /// @param token The address of the ERC20 token to withdraw
    function withdrawToken(address token) external onlyOwner nonReentrant {
        IERC20Upgradeable erc20 = IERC20Upgradeable(token);
        uint256 balance = erc20.balanceOf(address(this));
        require(balance > 0, "No token balance to withdraw");

        erc20.safeTransfer(msg.sender, balance);
        emit TokenWithdrawn(msg.sender, token, balance);
    }

    /// @notice Returns the total Flare rewards received by a user
    function getFlareRewardsReceived(address user) external view returns (uint256) {
        return flareRewardsReceived[user];
    }

    /// @notice Returns the total ERC20 token rewards received by a user
    function getTokenRewardsReceived(address user, address token) external view returns (uint256) {
        return tokenRewardsReceived[user][token];
    }

    /// @notice Returns the contract's current Flare balance
    function getFlareBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns the contract's current token balance for a specified token
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20Upgradeable(token).balanceOf(address(this));
    }

    /// @notice Returns the contract version
    function getVersion() public pure returns (string memory) {
        return "1.0.1"; // Updated version string for new deployment
    }

    /// @notice Fallback function to allow the contract to receive Flare
    receive() external payable {
        emit FlareDeposited(msg.sender, msg.value);
    }

    // Private gap for upgradeability; keep space for adding state variables
    uint256[50] private __gap;
}`;

export const MembershipContractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IFtso {
    function getCurrentPriceWithDecimals() external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals);
}

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract MembershipNFT is Initializable, ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    // Name and symbol for the token
    string public name;
    string public symbol;
    
    // FTSO Price Feed
    IFtso public ftso;
    
    // Tier Constants with Updated Names
    uint256 public constant TOP_TIER = 0;
    uint256 public constant RHODIUM = 1;
    uint256 public constant PLATINUM = 2;
    uint256 public constant GOLD = 3;
    uint256 public constant RUTHENIUM = 4;
    uint256 public constant IRIDIUM = 5;
    uint256 public constant OSMIUM = 6;
    uint256 public constant PALLADIUM = 7;
    uint256 public constant RHENIUM = 8;
    uint256 public constant SILVER = 9;

    // ERC20 Token type constants
    uint256 public constant DBW_TOKEN = 0;
    uint256 public constant DBT_TOKEN = 1;
    uint256 public constant DBWF_TOKEN = 2;
    uint256 public constant DBWL_TOKEN = 3;
    uint256 public constant NFTC_TOKEN = 4;

    // Payment method constants
    uint256 public constant PAYMENT_FLR = 0;
    uint256 public constant PAYMENT_USDT = 1;
    uint256 public constant PAYMENT_USDC_E = 2;

    // ERC20 token addresses
    IERC20 public dbwToken;
    IERC20 public dbtToken;
    IERC20 public dbwfToken;
    IERC20 public dbwlToken;
    IERC20 public nftcToken;

    // Stablecoin token addresses
    IERC20 public usdtToken;
    IERC20 public usdcEToken;

    // Mapping to store token reward amounts per tier
    mapping(uint256 => mapping(uint256 => uint256)) public tierTokenRewards;

    // Struct for tier ownership information
    struct TierOwnership {
        uint256 tier;
        uint256 amount;
        uint256 mintTimestamp;
    }

    // USD prices (with 2 decimals, e.g., 960000 = $9,600.00)
    mapping(uint256 => uint256) public tierUSDPrices;
    
    // Other state variables
    address public poolWallet;
    address public companyWallet;
    address public partnerWallet;
    mapping(uint256 => string) public tierURIs;
    mapping(uint256 => uint256) public maxSupplyPerTier;
    mapping(uint256 => uint256) public currentSupplyPerTier;
    mapping(address => address) public referrer;
    uint256 public totalMaxSupply;
    mapping(address => mapping(uint256 => uint256)) public userMintTimestamps;

    // User token reward tracking
    mapping(address => mapping(uint256 => uint256)) public userTotalTokenRewards;

    // Mapping to track equivalent FLR value for stablecoin payments
    mapping(address => mapping(uint256 => uint256)) public stablecoinMintFLREquivalent;

    // Enhanced referral tracking
    struct ReferralInfo {
        uint256 totalReferrals;       // Total number of successful referrals
        uint256 totalEarned;          // Total amount earned from referrals in FLR
        uint256 lastReferralTime;     // Timestamp of last successful referral
        uint256[] referralAmounts;    // Array of individual referral amounts
        uint256[] referralTimes;      // Array of referral timestamps
        address[] referredUsers;      // Array of referred user addresses
        uint256[] referralTiers;      // Array of tiers that were referred
    }

    // Mapping to store referral information
    mapping(address => ReferralInfo) public referralStats;
    
    // Events - Optimized
    event MembershipMinted(
        address indexed account, 
        uint256 indexed tier, 
        uint256 amount, 
        uint256 timestamp,
        address referrer,
        uint256 usdPrice,
        uint256 flrAmount
    );

    event MembershipMintedWithERC20(
        address indexed account, 
        uint256 indexed tier, 
        uint256 amount, 
        uint256 timestamp,
        address referrer,
        uint256 usdPrice,
        uint256 tokenAmount,
        uint256 paymentMethod,
        uint256 flrEquivalent
    );
    
    event TierUSDPriceUpdated(uint256 indexed tier, uint256 newUSDPrice);
    event TierURIUpdated(uint256 indexed tier, string newURI);
    event WalletUpdated(string indexed walletType, address newWallet);
    event FTSOUpdated(address newFtso);
    event ReferralPayment(
        address indexed referrer,
        address indexed buyer,
        uint256 indexed tier,
        uint256 referralAmount,
        uint256 referralPercentage
    );
    event ReferralRewardsClaimed(
        address indexed referrer,
        uint256 totalAmount,
        uint256 timestamp
    );
    event TokenRewardDistributed(
        address indexed user, 
        uint256 indexed tier, 
        uint256 indexed tokenType, 
        uint256 amount
    );
    event TokenAddressUpdated(uint256 indexed tokenType, address tokenAddress);
    event TierTokenRewardUpdated(uint256 indexed tier, uint256 indexed tokenType, uint256 amount);

    // Custom modifiers for validation
    modifier validTier(uint256 tier) {
        require(tier <= SILVER, "Invalid tier");
        _;
    }
    
    modifier validTokenType(uint256 tokenType) {
        require(tokenType <= NFTC_TOKEN, "Invalid token type");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _baseUri, 
        address _poolWallet, 
        address _companyWallet,
        address _partnerWallet,
        address _ftso
    ) public initializer {
        __ERC1155_init(_baseUri);
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        name = "Defi Bull Membership NFTs";
        symbol = "BDWM";
        
        // Set wallets and FTSO
        poolWallet = _poolWallet;
        companyWallet = _companyWallet;
        partnerWallet = _partnerWallet;
        ftso = IFtso(_ftso);
        
        // Initialize stablecoin addresses with hard-coded values
        usdtToken = IERC20(0x0B38e83B86d491735fEaa0a791F65c2B99535396);
        usdcEToken = IERC20(0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6);
        
       tierUSDPrices[TOP_TIER] = 960000;     // $9,600.00
        tierUSDPrices[RHODIUM] = 480000;      // $4,800.00
        tierUSDPrices[PLATINUM] = 240000;     // $2,400.00
        tierUSDPrices[GOLD] = 120000;         // $1,200.00
        tierUSDPrices[RUTHENIUM] = 60000;     // $600.00
        tierUSDPrices[IRIDIUM] = 30000;       // $300.00
        tierUSDPrices[OSMIUM] = 15000;        // $150.00
        tierUSDPrices[PALLADIUM] = 7500;      // $75.00
        tierUSDPrices[RHENIUM] = 3750;        // $37.50
        tierUSDPrices[SILVER] = 1875;         // $18.75
        
        // Initialize max supply per tier
        maxSupplyPerTier[TOP_TIER] = 25;
        maxSupplyPerTier[RHODIUM] = 50;
        maxSupplyPerTier[PLATINUM] = 100;
        maxSupplyPerTier[GOLD] = 200;
        maxSupplyPerTier[RUTHENIUM] = 400;
        maxSupplyPerTier[IRIDIUM] = 800;
        maxSupplyPerTier[OSMIUM] = 1600;
        maxSupplyPerTier[PALLADIUM] = 3200;
        maxSupplyPerTier[RHENIUM] = 6400;
        maxSupplyPerTier[SILVER] = 12800;

        totalMaxSupply = 25275; // Total including SILVER tier
        
        // Initialize token reward amounts for each tier (assuming 18 decimals for all tokens)
        // TOP_TIER
        tierTokenRewards[TOP_TIER][DBW_TOKEN] = 32000 * 10**18;
        tierTokenRewards[TOP_TIER][DBT_TOKEN] = 30000 * 10**18;
        tierTokenRewards[TOP_TIER][DBWF_TOKEN] = 24000 * 10**18;
        tierTokenRewards[TOP_TIER][DBWL_TOKEN] = 24000 * 10**18;
        tierTokenRewards[TOP_TIER][NFTC_TOKEN] = 24000 * 10**18;
        
        // RHODIUM
        tierTokenRewards[RHODIUM][DBW_TOKEN] = 16000 * 10**18;
        tierTokenRewards[RHODIUM][DBT_TOKEN] = 15000 * 10**18;
        tierTokenRewards[RHODIUM][DBWF_TOKEN] = 12000 * 10**18;
        tierTokenRewards[RHODIUM][DBWL_TOKEN] = 12000 * 10**18;
        tierTokenRewards[RHODIUM][NFTC_TOKEN] = 12000 * 10**18;
        
        // PLATINUM
        tierTokenRewards[PLATINUM][DBW_TOKEN] = 8000 * 10**18;
        tierTokenRewards[PLATINUM][DBT_TOKEN] = 7500 * 10**18;
        tierTokenRewards[PLATINUM][DBWF_TOKEN] = 6000 * 10**18;
        tierTokenRewards[PLATINUM][DBWL_TOKEN] = 6000 * 10**18;
        tierTokenRewards[PLATINUM][NFTC_TOKEN] = 6000 * 10**18;
        
        // GOLD
        tierTokenRewards[GOLD][DBW_TOKEN] = 4000 * 10**18;
        tierTokenRewards[GOLD][DBT_TOKEN] = 3750 * 10**18;
        tierTokenRewards[GOLD][DBWF_TOKEN] = 3000 * 10**18;
        tierTokenRewards[GOLD][DBWL_TOKEN] = 3000 * 10**18;
        
        // RUTHENIUM
        tierTokenRewards[RUTHENIUM][DBW_TOKEN] = 2000 * 10**18;
        tierTokenRewards[RUTHENIUM][DBT_TOKEN] = 1875 * 10**18;
        tierTokenRewards[RUTHENIUM][DBWF_TOKEN] = 1500 * 10**18;
        
        // IRIDIUM
        tierTokenRewards[IRIDIUM][DBW_TOKEN] = 800 * 10**18;
        tierTokenRewards[IRIDIUM][DBT_TOKEN] = 938 * 10**18;
        
        // OSMIUM
        tierTokenRewards[OSMIUM][DBW_TOKEN] = 400 * 10**18;
        
        // PALLADIUM
        tierTokenRewards[PALLADIUM][DBW_TOKEN] = 200 * 10**18;
        
        // RHENIUM
        tierTokenRewards[RHENIUM][DBW_TOKEN] = 100 * 10**18;
    }

    // Price calculation functions
    function getFlareAmount(uint256 usdPrice) public view returns (uint256) {
        // Get current price from FTSO
        (uint256 flarePrice, , ) = ftso.getCurrentPriceWithDecimals();
        
        // usdPrice comes in cents (2 decimals), convert to USD and calculate FLR amount
        return (usdPrice * 1e18 * 1e5) / (flarePrice * 100);
    }

// Refactor the function to use fewer local variables
function mint(uint256 _tier, uint256 _amount, address _referrer) external payable validTier(_tier) {
    require(_amount > 0, "Amount must be greater than 0");
    require(
        currentSupplyPerTier[_tier] + _amount <= maxSupplyPerTier[_tier],
        "Exceeds max supply for tier"
    );
    
    // Calculate payment
    uint256 usdPrice = tierUSDPrices[_tier] * _amount;
    uint256 flareRequired = getFlareAmount(usdPrice);
    require(msg.value == flareRequired, "Incorrect payment amount");
    
    // Calculate and transfer partner share (2%)
    uint256 partnerShare = (msg.value * 2) / 100;
    (bool success,) = payable(partnerWallet).call{value: partnerShare}("");
    require(success, "Partner payment failed");
    
    // Calculate remaining amount to split
    uint256 halfRemaining = (msg.value - partnerShare) / 2;
    
    // Transfer to pool wallet (always gets the full half)
    (success,) = payable(poolWallet).call{value: halfRemaining}("");
    require(success, "Pool payment failed");
    
    // Handle referral and get adjusted company share
    uint256 companyShare = _handleReferral(_referrer, _tier, halfRemaining, false, address(0));
    
    // Transfer adjusted company share (after referral payment)
    (success,) = payable(companyWallet).call{value: companyShare}("");
    require(success, "Company payment failed");
    
    // Record mint timestamp and mint NFT
    uint256 timestamp = block.timestamp;
    userMintTimestamps[msg.sender][_tier] = timestamp;
    _mint(msg.sender, _tier, _amount, "");
    currentSupplyPerTier[_tier] += _amount;
    
    // Distribute token rewards
    _distributeTokenRewards(msg.sender, _tier, _amount);
    
    emit MembershipMinted(msg.sender, _tier, _amount, timestamp, _referrer, usdPrice, msg.value);
}
   // Helper function to get the payment token based on payment method
function _getPaymentToken(uint256 paymentMethod) internal view returns (IERC20) {
    if (paymentMethod == PAYMENT_USDT) {
        return usdtToken;
    } else {
        return usdcEToken;
    }
}

// Helper function to calculate token amount based on USD price
function _calculateTokenAmount(uint256 usdPriceInCents, IERC20 paymentToken) internal view returns (uint256) {
    uint8 tokenDecimals = paymentToken.decimals();
    return (usdPriceInCents * 10**tokenDecimals) / 100;
}

// Helper function to process the payment and shares
function _processERC20Payment(IERC20 paymentToken, uint256 tokenAmount, uint256 tier, address _referrer) internal returns (uint256, uint256) {
    // Transfer the tokens from user to this contract
    require(paymentToken.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");
    
    // Calculate shares
    uint256 partnerShare = (tokenAmount * 2) / 100;  // 2%
    uint256 remainingAmount = tokenAmount - partnerShare;
    uint256 poolShare = remainingAmount / 2;    // 49% of total
    uint256 companyShare = remainingAmount / 2; // 49% of total
    
    // Handle referral
    companyShare = _handleReferral(_referrer, tier, companyShare, true, address(paymentToken));
    
    // Transfer shares
    require(paymentToken.transfer(partnerWallet, partnerShare), "Partner payment failed");
    require(paymentToken.transfer(poolWallet, poolShare), "Pool payment failed");
    require(paymentToken.transfer(companyWallet, companyShare), "Company payment failed");
    
    return (tokenAmount, block.timestamp);
}

// Modified mintWithERC20 function with fewer local variables
function mintWithERC20(uint256 tier, uint256 amount, address _referrer, uint256 paymentMethod) external validTier(tier) {
    require(amount > 0, "Amount must be greater than 0");
    require(
        currentSupplyPerTier[tier] + amount <= maxSupplyPerTier[tier],
        "Exceeds max supply for tier"
    );
    require(paymentMethod == PAYMENT_USDT || paymentMethod == PAYMENT_USDC_E, "Invalid payment method");
    
    // Get payment token
    IERC20 paymentToken = _getPaymentToken(paymentMethod);
    require(address(paymentToken) != address(0), "Token not set");
    
    // Calculate USD price and token amount
    uint256 usdPriceInCents = tierUSDPrices[tier] * amount;
    uint256 tokenAmount = _calculateTokenAmount(usdPriceInCents, paymentToken);
    
    // Check if user has enough allowance
    require(paymentToken.allowance(msg.sender, address(this)) >= tokenAmount, "Insufficient allowance");
    
    // Process payment and get timestamp
    uint256 timestamp;
    (tokenAmount, timestamp) = _processERC20Payment(paymentToken, tokenAmount, tier, _referrer);
    
    // Calculate and store FLR equivalent
    uint256 flrEquivalent = getFlareAmount(usdPriceInCents);
    stablecoinMintFLREquivalent[msg.sender][tier] = flrEquivalent;
    
    // Record mint timestamp and mint NFT
    userMintTimestamps[msg.sender][tier] = timestamp;
    _mint(msg.sender, tier, amount, "");
    currentSupplyPerTier[tier] += amount;
    
    // Distribute token rewards
    _distributeTokenRewards(msg.sender, tier, amount);
    
    emit MembershipMintedWithERC20(
        msg.sender, 
        tier, 
        amount, 
        timestamp, 
        _referrer, 
        usdPriceInCents, 
        tokenAmount, 
        paymentMethod,
        flrEquivalent
    );
}
    
    // Refactored common referral handling logic
    function _handleReferral(
        address _referrer, 
        uint256 tier, 
        uint256 companyShare, 
        bool isERC20, 
        address paymentToken
    ) internal returns (uint256) {
        if (_referrer == address(0) || _referrer == msg.sender) {
            return companyShare;
        }
        
        uint256 referralAmount;
        uint256 referralPercentage;
        
        if (tier <= RUTHENIUM) {
            referralAmount = (companyShare * 5) / 100;
            referralPercentage = 5;
        } else {
            referralAmount = (companyShare * 10) / 100;
            referralPercentage = 10;
        }
        
        // Process payment based on type
        if (isERC20) {
            require(IERC20(paymentToken).transfer(_referrer, referralAmount), "Referral payment failed");
        } else {
            (bool referralSuccess,) = payable(_referrer).call{value: referralAmount}("");
            require(referralSuccess, "Referral payment failed");
        }
        
        companyShare -= referralAmount;
        
        // Update referral tracking with detailed information
        ReferralInfo storage refInfo = referralStats[_referrer];
        if (referrer[msg.sender] == address(0)) {
            referrer[msg.sender] = _referrer;
            refInfo.totalReferrals += 1;
        }
        refInfo.totalEarned += referralAmount;
        refInfo.lastReferralTime = block.timestamp;
        refInfo.referralAmounts.push(referralAmount);
        refInfo.referralTimes.push(block.timestamp);
        refInfo.referredUsers.push(msg.sender);
        refInfo.referralTiers.push(tier);
        
        emit ReferralPayment(_referrer, msg.sender, tier, referralAmount, referralPercentage);
        emit ReferralRewardsClaimed(_referrer, referralAmount, block.timestamp);
        
        return companyShare;
    }

    // Get the FLR equivalent for a stablecoin payment
    function getStablecoinMintFLREquivalent(address user, uint256 tier) external view validTier(tier) returns (uint256) {
        return stablecoinMintFLREquivalent[user][tier];
    }

    // Function to distribute ERC20 token rewards
    function _distributeTokenRewards(address to, uint256 tier, uint256 amount) internal {
        // Distribute token rewards if token is set and reward amount > 0
        _distributeTokenReward(to, tier, DBW_TOKEN, amount, dbwToken);
        _distributeTokenReward(to, tier, DBT_TOKEN, amount, dbtToken);
        _distributeTokenReward(to, tier, DBWF_TOKEN, amount, dbwfToken);
        _distributeTokenReward(to, tier, DBWL_TOKEN, amount, dbwlToken);
        _distributeTokenReward(to, tier, NFTC_TOKEN, amount, nftcToken);
    }
    
    // Helper function to distribute a single token reward
    function _distributeTokenReward(
        address to, 
        uint256 tier, 
        uint256 tokenType, 
        uint256 amount, 
        IERC20 token
    ) internal {
        if (address(token) != address(0) && tierTokenRewards[tier][tokenType] > 0) {
            uint256 tokenAmount = tierTokenRewards[tier][tokenType] * amount;
            bool success = token.transfer(to, tokenAmount);
            require(success, "Token transfer failed");
            
            // Update user's total received tokens
            userTotalTokenRewards[to][tokenType] += tokenAmount;
            
            emit TokenRewardDistributed(to, tier, tokenType, tokenAmount);
        }
    }

    // Admin functions to set token addresses
    function setDBWTokenAddress(address _tokenAddress) external onlyOwner {
        dbwToken = IERC20(_tokenAddress);
        emit TokenAddressUpdated(DBW_TOKEN, _tokenAddress);
    }
    
    function setDBTTokenAddress(address _tokenAddress) external onlyOwner {
        dbtToken = IERC20(_tokenAddress);
        emit TokenAddressUpdated(DBT_TOKEN, _tokenAddress);
    }
    
    function setDBWFTokenAddress(address _tokenAddress) external onlyOwner {
        dbwfToken = IERC20(_tokenAddress);
        emit TokenAddressUpdated(DBWF_TOKEN, _tokenAddress);
    }
    
    function setDBWLTokenAddress(address _tokenAddress) external onlyOwner {
        dbwlToken = IERC20(_tokenAddress);
        emit TokenAddressUpdated(DBWL_TOKEN, _tokenAddress);
    }
    
    function setNFTCTokenAddress(address _tokenAddress) external onlyOwner {
        nftcToken = IERC20(_tokenAddress);
        emit TokenAddressUpdated(NFTC_TOKEN, _tokenAddress);
    }
    
    // Admin function to set token reward amount for a specific tier
    function setTierTokenReward(uint256 tier, uint256 tokenType, uint256 amount) 
        external 
        onlyOwner 
        validTier(tier) 
        validTokenType(tokenType) 
    {
        tierTokenRewards[tier][tokenType] = amount;
        emit TierTokenRewardUpdated(tier, tokenType, amount);
    }

    // Admin functions
    function setFTSO(address _newFtso) external onlyOwner {
        ftso = IFtso(_newFtso);
        emit FTSOUpdated(_newFtso);
    }

    function setTierUSDPrice(uint256 tier, uint256 newUSDPrice) external onlyOwner validTier(tier) {
        tierUSDPrices[tier] = newUSDPrice;
        emit TierUSDPriceUpdated(tier, newUSDPrice);
    }

    function setPoolWallet(address _newPoolWallet) external onlyOwner {
        poolWallet = _newPoolWallet;
        emit WalletUpdated("pool", _newPoolWallet);
    }

    function setCompanyWallet(address _newCompanyWallet) external onlyOwner {
        companyWallet = _newCompanyWallet;
        emit WalletUpdated("company", _newCompanyWallet);
    }

    function setPartnerWallet(address _newPartnerWallet) external onlyOwner {
        partnerWallet = _newPartnerWallet;
        emit WalletUpdated("partner", _newPartnerWallet);
    }

    function setTierURI(uint256 tier, string memory newUri) external onlyOwner validTier(tier) {
        tierURIs[tier] = newUri;
        emit TierURIUpdated(tier, newUri);
    }

    // View functions
    function uri(uint256 tier) public view override returns (string memory) {
        return tierURIs[tier];
    }
    
    function getTierUSDPrice(uint256 tier) external view validTier(tier) returns (uint256) {
        return tierUSDPrices[tier];
    }
    
    function getTierFlarePrice(uint256 tier) external view validTier(tier) returns (uint256) {
        return getFlareAmount(tierUSDPrices[tier]);
    }
    
    function getTierSupply(uint256 tier) external view validTier(tier) returns (uint256 current, uint256 max) {
        return (currentSupplyPerTier[tier], maxSupplyPerTier[tier]);
    }

    function totalSupply() external view returns (uint256) {
        uint256 total = 0;
        for(uint256 i = 0; i <= SILVER; i++) {
            total += currentSupplyPerTier[i];
        }
        return total;
    }

    function maxSupply() external view returns (uint256) {
        return totalMaxSupply;
    }

    function getUserMintTimestamp(address user, uint256 tier) external view validTier(tier) returns (uint256) {
        return userMintTimestamps[user][tier];
    }

    function getReferrer(address user) external view returns (address) {
        return referrer[user];
    }

    // Get token reward amount for a specific tier and token type
    function getTierTokenReward(uint256 tier, uint256 tokenType) external view 
        validTier(tier) 
        validTokenType(tokenType) 
        returns (uint256) 
    {
        return tierTokenRewards[tier][tokenType];
    }

    // Get user's total received tokens of a specific type
    function getUserTotalTokenRewards(address user, uint256 tokenType) external view 
        validTokenType(tokenType) 
        returns (uint256) 
    {
        return userTotalTokenRewards[user][tokenType];
    }
    
    // Function to get all token rewards for a user
    function getUserAllTokenRewards(address user) external view returns (uint256[5] memory tokenAmounts) {
        for(uint256 i = 0; i <= NFTC_TOKEN; i++) {
            tokenAmounts[i] = userTotalTokenRewards[user][i];
        }
        return tokenAmounts;
    }

    // Enhanced referral tracking view functions
    function getReferralHistory(address user) external view returns (
        address[] memory users,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        uint256[] memory tiers
    ) {
        ReferralInfo storage info = referralStats[user];
        return (
            info.referredUsers,
            info.referralAmounts,
            info.referralTimes,
            info.referralTiers
        );
    }

    function getReferralStats(address user) external view returns (
        uint256 totalReferrals,
        uint256 totalEarned,
        uint256 lastReferralTime
    ) {
        ReferralInfo storage info = referralStats[user];
        return (
            info.totalReferrals,
            info.totalEarned,
            info.lastReferralTime
        );
    }

    function getTotalReferralRewards(address user) external view returns (uint256) {
        return referralStats[user].totalEarned;
    }

    // NFT ownership tracking functions
    function getUserTiers(address user) external view returns (TierOwnership[] memory) {
        // Create an array to hold owned tiers
        TierOwnership[] memory ownedTiers = new TierOwnership[](SILVER + 1);
        uint256 count = 0;
        
        // Check each tier
        for(uint256 i = 0; i <= SILVER; i++) {
            uint256 balance = balanceOf(user, i);
            if(balance > 0) {
                ownedTiers[count] = TierOwnership({
                    tier: i,
                    amount: balance,
                    mintTimestamp: userMintTimestamps[user][i]
                });
                count++;
            }
        }
        
        // Create properly sized array with only owned tiers
        TierOwnership[] memory result = new TierOwnership[](count);
        for(uint256 i = 0; i < count; i++) {
            result[i] = ownedTiers[i];
        }
        
        return result;
    }

    function getHighestTier(address user) external view returns (uint256) {
        for(uint256 i = 0; i <= SILVER; i++) {
            if(balanceOf(user, i) > 0) {
                return i;
            }
        }
        return type(uint256).max; // Return max uint if no tiers owned
    }

    function getTierBalance(address user, uint256 tier) external view validTier(tier) returns (uint256) {
        return balanceOf(user, tier);
    }

    function hasTier(address user, uint256 tier) external view validTier(tier) returns (bool) {
        return balanceOf(user, tier) > 0;
    }

    // Function to get all ownership info in a single call
    function getUserOwnershipInfo(address user) external view returns (
        TierOwnership[] memory ownedTiers,
        uint256 highestTier,
        uint256 totalNFTs
    ) {
        // Get owned tiers
        ownedTiers = this.getUserTiers(user);
        
        // Calculate highest tier and total NFTs
        highestTier = type(uint256).max;
        totalNFTs = 0;
        
        for(uint256 i = 0; i <= SILVER; i++) {
            uint256 balance = balanceOf(user, i);
            if(balance > 0) {
                if(highestTier == type(uint256).max || i < highestTier) {
                    highestTier = i;
                }
                totalNFTs += balance;
            }
        }
        
        return (ownedTiers, highestTier, totalNFTs);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    // Add a storage gap for future upgrades
    uint256[50] private __gap;
}`;