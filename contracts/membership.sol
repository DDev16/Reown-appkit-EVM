// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MembershipNFT is Initializable, ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    // Constants
    uint256 public constant TIER_1 = 0;
    uint256 public constant TIER_2 = 1;
    uint256 public constant TIER_3 = 2;
    uint256 public constant TIER_4 = 3;
    uint256 public constant TIER_5 = 4;
    uint256 public constant TIER_6 = 5;

    // State variables
    address public trueGemsWallet;
    mapping(uint256 => uint256) public tierPrices;
    mapping(uint256 => string) public tierURIs;
    mapping(uint256 => uint256) public maxSupplyPerTier;
    mapping(uint256 => uint256) public currentSupplyPerTier;
    
    // Events
    event MembershipMinted(address indexed account, uint256 indexed tier, uint256 amount);
    event TierPriceUpdated(uint256 indexed tier, uint256 newPrice);
    event TierURIUpdated(uint256 indexed tier, string newURI);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _trueGemsWallet,
        string memory _baseUri
    ) public initializer {
        __ERC1155_init(_baseUri);
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        
        trueGemsWallet = _trueGemsWallet;
        
        // Initialize tier prices (in wei)
        tierPrices[TIER_1] = 0.1 ether;
        tierPrices[TIER_2] = 0.2 ether;
        tierPrices[TIER_3] = 0.3 ether;
        tierPrices[TIER_4] = 0.4 ether;
        tierPrices[TIER_5] = 0.5 ether;
        tierPrices[TIER_6] = 0.6 ether;
        
        // Initialize max supply per tier
        maxSupplyPerTier[TIER_1] = 1000;
        maxSupplyPerTier[TIER_2] = 750;
        maxSupplyPerTier[TIER_3] = 500;
        maxSupplyPerTier[TIER_4] = 250;
        maxSupplyPerTier[TIER_5] = 100;
        maxSupplyPerTier[TIER_6] = 50;
    }

    // Mint function
    function mint(uint256 tier, uint256 amount) external payable {
        require(tier <= TIER_6, "Invalid tier");
        require(amount > 0, "Amount must be greater than 0");
        require(
            currentSupplyPerTier[tier] + amount <= maxSupplyPerTier[tier],
            "Exceeds max supply for tier"
        );
        
        uint256 totalPrice = tierPrices[tier] * amount;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Calculate and transfer 10% fee to True Gems
        uint256 fee = (totalPrice * 10) / 100;
        (bool feeSuccess,) = payable(trueGemsWallet).call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");
        
        // Transfer remaining amount to contract owner
        uint256 remaining = totalPrice - fee;
        (bool remainingSuccess,) = payable(owner()).call{value: remaining}("");
        require(remainingSuccess, "Remaining transfer failed");
        
        // Mint NFT
        _mint(msg.sender, tier, amount, "");
        currentSupplyPerTier[tier] += amount;
        
        emit MembershipMinted(msg.sender, tier, amount);
        
        // Refund excess payment if any
        uint256 excess = msg.value - totalPrice;
        if (excess > 0) {
            (bool refundSuccess,) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Refund transfer failed");
        }
    }

    // Admin functions
    function setTierPrice(uint256 tier, uint256 newPrice) external onlyOwner {
        require(tier <= TIER_6, "Invalid tier");
        tierPrices[tier] = newPrice;
        emit TierPriceUpdated(tier, newPrice);
    }
    
    function setTierURI(uint256 tier, string memory newUri) external onlyOwner {
        require(tier <= TIER_6, "Invalid tier");
        tierURIs[tier] = newUri;
        emit TierURIUpdated(tier, newUri);
    }
    
    function setTrueGemsWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid address");
        trueGemsWallet = newWallet;
    }

    // View functions
    function uri(uint256 tier) public view override returns (string memory) {
        return tierURIs[tier];
    }
    
    function getTierPrice(uint256 tier) external view returns (uint256) {
        return tierPrices[tier];
    }
    
    function getTierSupply(uint256 tier) external view returns (uint256 current, uint256 max) {
        return (currentSupplyPerTier[tier], maxSupplyPerTier[tier]);
    }

    // Required overrides for UUPS
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}