// SPDX-License-Identifier: MIT
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
}