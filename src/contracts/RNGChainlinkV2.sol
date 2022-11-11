// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "./RNGChainlinkV2Interface.sol";

/**

SE UTILIZA LA RED DE PRUEBAS GOERLI

 */

contract RNGChainlinkV2 is RNGChainlinkV2Interface, VRFConsumerBaseV2 {
    /* ============ Global Variables ============ */

    /// @dev Reference to the VRFCoordinatorV2 deployed contract
    VRFCoordinatorV2Interface internal vrfCoordinator;
    address vrfCoordinatorAddress = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;

    /// @dev A counter for the number of requests made used for request ids
    uint32 internal requestCounter;

    /// @dev Chainlink VRF subscription id
    uint64 internal subscriptionId;

    /// @dev Hash of the public key used to verify the VRF proof
    bytes32 internal keyHash =
        0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;

    /// @dev A list of random numbers from past requests mapped by request id
    mapping(uint32 => uint256[]) internal randomNumbers;

    /// @dev A list of blocks to be locked at based on past requests mapped by request id
    mapping(uint32 => uint32) internal requestLockBlock;

    /// @dev A mapping from Chainlink request ids to internal request ids
    mapping(uint256 => uint32) internal chainlinkRequestIds;

    address s_owner;

    /* ============ Events ============ */

    /**
     * @notice Emitted when the Chainlink VRF keyHash is set
     * @param keyHash Chainlink VRF keyHash
     */
    event KeyHashSet(bytes32 keyHash);

    /**
     * @notice Emitted when the Chainlink VRF subscription id is set
     * @param subscriptionId Chainlink VRF subscription id
     */
    event SubscriptionIdSet(uint64 subscriptionId);

    /**
     * @notice Emitted when the Chainlink VRF Coordinator address is set
     * @param vrfCoordinator Address of the VRF Coordinator
     */
    event VrfCoordinatorSet(VRFCoordinatorV2Interface indexed vrfCoordinator);

    /* ============ Constructor ============ */

    /**
     * @notice Constructor of the contract
     * @param _subscriptionId Chainlink VRF subscription id
     */
    constructor(uint64 _subscriptionId)
        VRFConsumerBaseV2(vrfCoordinatorAddress)
    {
        s_owner = msg.sender;
        _setVRFCoordinator(VRFCoordinatorV2Interface(vrfCoordinatorAddress));
        _setSubscriptionId(_subscriptionId);
        _setKeyhash(keyHash);
    }

    modifier onlyOwnerRNG() {
        require(msg.sender == s_owner, "The caller is not the owner");
        _;
    }

    /* ============ External Functions ============ */

    /// @inheritdoc RNGInterface
    function requestRandomNumber()
        public
        override
        onlyOwnerRNG
        returns (uint32 requestId, uint32 lockBlock)
    {
        uint256 _vrfRequestId = vrfCoordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            3,
            1000000,
            3
        );

        requestCounter++;
        uint32 _requestCounter = requestCounter;

        requestId = _requestCounter;
        chainlinkRequestIds[_vrfRequestId] = _requestCounter;

        lockBlock = uint32(block.number);
        requestLockBlock[_requestCounter] = lockBlock;

        emit RandomNumberRequested(_requestCounter, msg.sender);

        return (requestId, lockBlock);
    }

    /// @inheritdoc RNGInterface
    function isRequestComplete(uint32 _internalRequestId)
        public
        view
        override
        returns (bool isCompleted)
    {
        return randomNumbers[_internalRequestId][0] != 0;
    }

    /// @inheritdoc RNGInterface
    function randomNumber(uint32 _internalRequestId)
        public
        view
        override
        returns (
            uint256 randomNum1,
            uint256 randomNum2,
            uint256 randNum3
        )
    {
        return (
            randomNumbers[_internalRequestId][0],
            randomNumbers[_internalRequestId][1],
            randomNumbers[_internalRequestId][2]
        );
    }

    /// @inheritdoc RNGInterface
    function getLastRequestId()
        external
        view
        override
        returns (uint32 requestId)
    {
        return requestCounter;
    }

    /// @inheritdoc RNGInterface
    function getRequestFee()
        external
        pure
        override
        returns (address feeToken, uint256 requestFee)
    {
        return (address(0), 0);
    }

    /// @inheritdoc RNGChainlinkV2Interface
    function getKeyHash() external view override returns (bytes32) {
        return keyHash;
    }

    /// @inheritdoc RNGChainlinkV2Interface
    function getSubscriptionId() external view override returns (uint64) {
        return subscriptionId;
    }

    /// @inheritdoc RNGChainlinkV2Interface
    function getVrfCoordinator()
        external
        view
        override
        returns (VRFCoordinatorV2Interface)
    {
        return vrfCoordinator;
    }

    /// @inheritdoc RNGChainlinkV2Interface
    function setSubscriptionId(uint64 _subscriptionId)
        external
        override
        onlyOwnerRNG
    {
        _setSubscriptionId(_subscriptionId);
    }

    /// @inheritdoc RNGChainlinkV2Interface
    function setKeyhash(bytes32 _keyHash) external override onlyOwnerRNG {
        _setKeyhash(_keyHash);
    }

    /* ============ Internal Functions ============ */

    /**
     * @notice Callback function called by VRF Coordinator
     * @dev The VRF Coordinator will only call it once it has verified the proof associated with the randomness.
     * @param _vrfRequestId Chainlink VRF request id
     * @param _randomWords Chainlink VRF array of random words
     */
    function fulfillRandomWords(
        uint256 _vrfRequestId,
        uint256[] memory _randomWords
    ) internal override {
        uint32 _internalRequestId = chainlinkRequestIds[_vrfRequestId];
        require(_internalRequestId > 0, "RNGChainLink/requestId-incorrect");

        randomNumbers[_internalRequestId] = _randomWords;

        emit RandomNumberCompleted(_internalRequestId, _randomWords);
    }

    /**
     * @notice Set Chainlink VRF coordinator contract address.
     * @param _vrfCoordinator Chainlink VRF coordinator contract address
     */
    function _setVRFCoordinator(VRFCoordinatorV2Interface _vrfCoordinator)
        internal
    {
        require(
            address(_vrfCoordinator) != address(0),
            "RNGChainLink/vrf-not-zero-addr"
        );
        vrfCoordinator = _vrfCoordinator;
        emit VrfCoordinatorSet(_vrfCoordinator);
    }

    /**
     * @notice Set Chainlink VRF subscription id associated with this contract.
     * @param _subscriptionId Chainlink VRF subscription id
     */
    function _setSubscriptionId(uint64 _subscriptionId) internal {
        require(_subscriptionId > 0, "RNGChainLink/subId-gt-zero");
        subscriptionId = _subscriptionId;
        emit SubscriptionIdSet(_subscriptionId);
    }

    /**
     * @notice Set Chainlink VRF keyHash.
     * @param _keyHash Chainlink VRF keyHash
     */
    function _setKeyhash(bytes32 _keyHash) internal {
        require(_keyHash != bytes32(0), "RNGChainLink/keyHash-not-empty");
        keyHash = _keyHash;
        emit KeyHashSet(_keyHash);
    }
}
