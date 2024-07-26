// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title TradingCardGame
 * @dev A smart contract for a simple trading card game where players can register,
 * create battles against a computer opponent, and resolve battles based on card stats.
 * The contract uses OpenZeppelin's Ownable contract for access control, allowing certain
 * functions to be restricted to the contract owner.
 */
contract TradingCardGame is Ownable {
    /// @notice The ERC721 contract representing the trading cards used in the game.
    IERC721 public cardContract;

    /// @notice The address representing the computer opponent in battles.
    address public computerAddress;

    /// @dev Structure representing a player in the game.
    struct Player {
        address playerAddress;  // The player's Ethereum address
        string playerName;      // The player's chosen name
        uint256 wins;           // The number of battles won by the player
        uint256 losses;         // The number of battles lost by the player
    }

    /// @dev Structure representing a battle between a player and the computer.
    struct Battle {
        BattleStatus battleStatus; // The current status of the battle
        uint256 battleId;          // Unique identifier for the battle
        address player;            // The address of the player
        uint256 playerCardId;      // The ID of the player's card
        uint256 computerCardId;    // The ID of the computer's card
        uint256 playerStatValue;   // The stat value of the player's card
        uint256 computerStatValue; // The stat value of the computer's card
        address winner;            // The address of the battle winner
    }

    /// @dev Enum representing the status of a battle.
    enum BattleStatus {
        Pending,    // Battle is pending (not started)
        InProgress, // Battle is currently in progress
        Finished    // Battle has finished
    }

    /// @dev Mapping of player addresses to their corresponding Player struct.
    mapping(address => Player) public players;

    /// @dev Mapping of battle IDs to their corresponding Battle struct.
    mapping(uint256 => Battle) public battles;

    /// @notice Emitted when a new player registers in the game.
    /// @param player The address of the new player
    /// @param name The name of the new player
    event NewPlayer(address indexed player, string name);

    /// @notice Emitted when a new battle is started.
    /// @param battleId The unique identifier for the battle
    /// @param player The address of the player
    /// @param playerCardId The ID of the player's card
    /// @param computerCardId The ID of the computer's card
    event BattleStarted(uint256 indexed battleId, address indexed player, uint256 playerCardId, uint256 computerCardId);

    /// @notice Emitted when a battle is finished.
    /// @param battleId The unique identifier for the battle
    /// @param winner The address of the battle winner
    /// @param loser The address of the battle loser
    event BattleFinished(uint256 indexed battleId, address indexed winner, address indexed loser);

    /**
     * @dev Constructor to initialize the TradingCardGame contract.
     * @param _cardContractAddress The address of the ERC721 card contract
     * @param _computerAddress The address representing the computer opponent
     */
    constructor(address _cardContractAddress, address _computerAddress) Ownable(msg.sender) {
        cardContract = IERC721(_cardContractAddress);
        computerAddress = _computerAddress; // Set the computer's address
    }

    /**
     * @notice Register a new player in the game.
     * @param _name The name chosen by the player
     * @dev The player must not already be registered.
     */
    function registerPlayer(string memory _name) external {
        require(bytes(players[msg.sender].playerName).length == 0, "Already registered");
        players[msg.sender] = Player(msg.sender, _name, 0, 0);
        emit NewPlayer(msg.sender, _name);
    }

    /**
     * @notice Create a new battle against the computer with a provided battle ID.
     * @param _battleId The unique identifier for the battle
     * @param _playerCardId The ID of the player's card
     * @param _computerCardId The ID of the computer's card
     * @param _playerStatValue The stat value of the player's card
     * @param _computerStatValue The stat value of the computer's card
     * @dev The player must own the card with ID `_playerCardId`.
     * The battle is automatically started upon creation.
     */
    function createBattle(uint256 _battleId, uint256 _playerCardId, uint256 _computerCardId, uint256 _playerStatValue, uint256 _computerStatValue) external {
        require(cardContract.ownerOf(_playerCardId) == msg.sender, "You don't own this card");
        require(battles[_battleId].battleId == 0, "Battle ID already exists");

        battles[_battleId] = Battle(
            BattleStatus.InProgress,
            _battleId,
            msg.sender,
            _playerCardId,
            _computerCardId,
            _playerStatValue,
            _computerStatValue,
            address(0)
        );

        emit BattleStarted(_battleId, msg.sender, _playerCardId, _computerCardId);
    }

    /**
     * @notice Resolve an in-progress battle and determine the winner.
     * @param _battleId The ID of the battle to resolve
     * @dev Only the player who initiated the battle or the contract owner can resolve the battle.
     * The winner is determined by comparing the player's card stat value with the computer's card stat value.
     */
    function resolveBattle(uint256 _battleId) external {
        Battle storage battle = battles[_battleId];
        require(battle.battleStatus == BattleStatus.InProgress, "Battle not in progress");
        require(msg.sender == battle.player || msg.sender == owner(), "Not authorized to resolve");

        battle.winner = battle.playerStatValue >= battle.computerStatValue ? battle.player : computerAddress;
        battle.battleStatus = BattleStatus.Finished;

        Player storage player = players[battle.player];
        if (battle.winner == battle.player) {
            player.wins++;
        } else {
            player.losses++;
        }

        emit BattleFinished(_battleId, battle.winner, battle.winner == battle.player ? computerAddress : battle.player);
    }

    /**
     * @notice Update the address representing the computer opponent.
     * @param _newAddress The new address for the computer opponent
     * @dev Only the contract owner can update the computer address.
     */
    function updateComputerAddress(address _newAddress) external onlyOwner {
        computerAddress = _newAddress;
    }
}
