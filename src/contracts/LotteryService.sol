// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./LotteryStorage.sol";
import "./Lottery.sol";
import "./Shares.sol";
import "./PriceConsumer.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract LotteryService is PriceConsumerV3, VRFConsumerBaseV2 {
    LotteryStorage lotteryStorage;

    address private _owner;
    mapping(address => bool) private authorized;

    // VRF
    VRFCoordinatorV2Interface private immutable vrfCoordinator;
    address vrfCoordinatorAddress = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;
    mapping(uint256 => address payable) private requestIdToLottery;
    uint64 private immutable subscriptionId;
    bytes32 private constant KEY_HASH = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;
    uint32 private constant CALLBACK_GAS_LIMIT = 200000;
    uint16 private constant REQUEST_CONFIRMATIONS = 5;
    uint32 private constant NUM_WORDS = 1;


    constructor(uint64 _subscriptionId) VRFConsumerBaseV2(vrfCoordinatorAddress) {
        _owner = msg.sender;
        authorized[msg.sender] = true;
        subscriptionId = _subscriptionId;
        vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorAddress);
        lotteryStorage = new LotteryStorage();
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender]);
        _;
    }

    modifier lotteryExists(address _addressLottery) {
        require(
            lotteryStorage.lotteryExists(_addressLottery),
            "La loteria no existe"
        );
        _;
    }

    function addAuthorized(address _address) public onlyOwner {
        authorized[_address] = true;
    }

    function removeAuthorized(address _address) public onlyOwner {
        authorized[_address] = false;
    }

    function checkNumBoleto(
        uint256 _numTicket,
        uint256 _numSerie,
        uint256 _numFraccion,
        uint256 _totalNumbers,
        uint256 _totalSeries
    ) internal pure returns (bool) {
        return
            (_numTicket >= 0) &&
            (_numTicket < _totalNumbers) &&
            (_numSerie >= 0) &&
            (_numSerie < _totalSeries) &&
            (_numFraccion >= 0) &&
            (_numFraccion < 10);
    }

    function getCostEth(uint256 ticketCost) public view returns (uint256) {
       return ((ticketCost * 10**26) / getLatestPrice());
       //return ticketCost;
    }

    function addLottery(address payable _lotteryContract) external onlyAuthorized {
        lotteryStorage.setLottery(_lotteryContract);
        emit lotteryAdded(_lotteryContract);
    }

    function getBenefits(address payable _lotteryId) external onlyOwner lotteryExists(_lotteryId){
        Lottery ticket = Lottery(_lotteryId);
        require(ticket.isLotteryFinished(), "La loteria aun no ha terminado");
        ticket.getBenefits(msg.sender);
    }

    function generateWinners(address payable _lotteryId) internal lotteryExists(_lotteryId)
    {
        Lottery ticket = Lottery(_lotteryId);
        (,uint256 date,,,,,uint256 minimumParticipants,uint256 totalPrize,,) = ticket.infoLottery();
        require(block.timestamp > date, "La loteria aun no ha terminado");
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        if(ticket.getTotalPurchasedTickets()>minimumParticipants){
            requestRandomNumber(_lotteryId);
            ticket.setLotteryFinished();
        }else{
            ticket.payPrize(totalPrize, _owner);
            ticket.setLotteryFailed();
        }
    }

    function finishLotteries() public {
        address payable[] memory unFinishedLotteries = lotteryStorage.getUnfinishedLotteries();
        Lottery ticket;
        uint256 date;
        for (uint256 i = 0; i < unFinishedLotteries.length; i++) {
            ticket = Lottery(unFinishedLotteries[i]);
            (,date,,,,,,,,) = ticket.infoLottery();
            if(block.timestamp < date){
                break;
            }
            generateWinners(unFinishedLotteries[i]);
            lotteryStorage.removeFirstLotteryFinished();
        }
    }

    function refundTicket(address payable _lotteryId, uint256 _tokenId) external lotteryExists(_lotteryId){
        Lottery ticket = Lottery(_lotteryId);
        require(ticket.isLotteryFailed(), "La loteria no ha fallado");
        uint256 amountShares = getSharesOfBuyer(_lotteryId,msg.sender,_tokenId);
        require(amountShares != 0, "No tiene participaciones de este ticket");
        uint256 totalSupplyShares = getTotalSupplyShares(_lotteryId, _tokenId);
        Shares(ticket.getTicketToShare(_tokenId).shares).burn(msg.sender, amountShares);
        uint256 refund = ((address(_lotteryId).balance * amountShares) / (ticket.getTotalPurchasedTickets() * totalSupplyShares));
        ticket.payPrize(refund, msg.sender);
    }

    function getPrize(address payable _lotteryId, uint256 _tokenId) external lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(ticket.isLotteryFinished(), "La loteria aun no ha terminado");
        require(ticket.isWinnerTicket(_tokenId), "Este ticket no tiene premio");
        uint256 amountShares = getSharesOfBuyer(_lotteryId,msg.sender,_tokenId);
        require(amountShares != 0, "No tiene participaciones de este ticket");
        uint256 totalSupplyShares = getTotalSupplyShares(_lotteryId, _tokenId);
        Shares(ticket.getTicketToShare(_tokenId).shares).burn(msg.sender, amountShares);
        ticket.payPrize((amountShares * ticket.getPrizeLottery()) / totalSupplyShares,msg.sender);
        emit prizeReceived(_lotteryId, _tokenId);
    }

    function buyTicket(
        address payable _lotteryId,
        uint256 _numTicket,
        uint256 _numSerie,
        uint256 _numFraccion,
        uint256 _totalShares
    ) external payable lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(_totalShares>0, "Debes adquirir mas de una participacion");
        require(ticket.isLotteryFinished(), "La loteria ya ha terminado");
        (,,,uint256 totalNumbers,uint256 totalSeries,uint256 ticketCost,,,,) = ticket.infoLottery();
        require(checkNumBoleto(_numTicket,_numSerie,_numFraccion,totalNumbers,totalSeries),"El numero,serie o fraccion no son correctos");
        uint256 ticketCostEth = getCostEth(ticketCost);
        require(msg.value >= ticketCostEth,"Necesitas mas ETH para comprar un ticket");
        uint256 refund = msg.value - ticketCostEth;
        uint256 tokenId = getTokenId(_lotteryId,_numTicket, _numSerie, _numFraccion);
        ticket.mintBoleto(msg.sender, tokenId, _totalShares);
        (bool success,)= msg.sender.call{value:refund}("");
        require(success, "Refund transfer failed");
        (success,)=_lotteryId.call{value:ticketCostEth}("");
        require(success, "Transfer failed");
        emit ticketBought(_lotteryId, tokenId, _totalShares);
    }

    function allowBuyShares(
        address payable _lotteryId,
        address _to,
        uint256 _amount,
        uint256 _tokenId
    ) external lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        Shares share = Shares(ticket.getTicketToShare(_tokenId).shares);
        require(share.balanceOf(msg.sender) >= _amount,"No tienes suficientes participaciones de este ticket");
        share.approve(msg.sender, _to, _amount);
    }

    function buyShares(
        address payable _lotteryId,
        address _from,
        uint256 _tokenId
    ) external payable lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        Shares share = Shares(ticket.getTicketToShare(_tokenId).shares);
        (,,,,,uint256 ticketCost,,,,) = Lottery(_lotteryId).infoLottery();
        uint256 amount = share.allowance(_from, msg.sender);
        require(0 < amount, "No tienes permiso para comprar participaciones");
        uint256 costOfShares = ((amount * getCostEth(ticketCost)) / share.totalSupply());
        require( msg.value >= costOfShares,"Necesitas mas ETH para comprar las participaciones");
        share.transferFrom(_from, msg.sender, amount);
        uint256 refund = msg.value - costOfShares;
        (bool success,)= msg.sender.call{value:refund}("");
        require(success, "Refund transfer failed");
        (success,)=payable(_from).call{value:costOfShares}("");
        require(success, "Payment failed");
        emit sharesBought(_lotteryId,_from, _tokenId, amount);
    }

    function requestRandomNumber(address payable _lotteryId) internal returns (uint256 requestId){
        uint256 _vrfRequestId = vrfCoordinator.requestRandomWords(
            KEY_HASH,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS);

        requestIdToLottery[_vrfRequestId] = _lotteryId;

        emit RandomNumberRequested(_vrfRequestId, _lotteryId);

        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address payable _lotteryId = requestIdToLottery[requestId];
        Lottery ticket = Lottery(_lotteryId);
        uint256[] memory winnerTickets = ticket.setWinnerTickets(randomWords);
        emit WinnersGenerated(_lotteryId, winnerTickets);
    }

    function getSharesOfBuyer(
        address payable _lotteryId,
        address _to,
        uint256 _tokenId
    ) public view lotteryExists(_lotteryId) returns (uint256) {
        address addressShare = Lottery(_lotteryId)
            .getTicketToShare(_tokenId)
            .shares;
        require(addressShare != address(0), "El ticket no ha sido comprado");
        return Shares(addressShare).balanceOf(_to);
    }

    function getTotalSupplyShares(
        address payable _lotteryId, 
        uint256 _tokenId
    ) public view lotteryExists(_lotteryId) returns (uint256) {
        address addressShare = Lottery(_lotteryId)
            .getTicketToShare(_tokenId)
            .shares;
        require(addressShare != address(0), "El ticket no ha sido comprado");
        return Shares(addressShare).totalSupply();
    }

    function getLotteries() external view returns (address payable[] memory) {
        return lotteryStorage.getLotteries();
    }

    function getUnfinishedLotteries() external view returns (address payable[] memory) {
        return lotteryStorage.getUnfinishedLotteries();
    }

    function getLottery(address payable _lotteryId) external view lotteryExists(_lotteryId)
        returns (
            string memory,
            uint256,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint32,
            uint256[] memory
        )
    {
        return (Lottery(_lotteryId).infoLottery());
    }

    function getTokenId(
        address payable _lotteryId,
        uint256 _numTicket,
        uint256 _numSerie,
        uint256 _numFraccion
    ) public view lotteryExists(_lotteryId) returns (uint256) {
        Lottery ticket = Lottery(_lotteryId);
        (,,,,uint256 totalSeries,,,,,) = ticket.infoLottery();
        return (_numTicket * (totalSeries * 10)) + (_numSerie * 10) + _numFraccion;
    }

    function owner() external view returns (address) {
        return _owner;
    }

    event lotteryAdded(address lotteryContract);
    event ticketBought(
        address lotteryId,
        uint256 tokenId,
        uint256 totalShares
    );
    event prizeReceived(address lotteryId, uint256 tokenId);
    event ticketAllowedToBuy(
        address lotteryId,
        address to,
        uint256 tokenId,
        uint256 amount
    );
    event sharesBought(
        address lotteryId,
        address from,
        uint256 tokenId,
        uint256 amount
    );

    event RandomNumberRequested(
        uint256 indexed requestId,
        address indexed lotteryId
    );

    event WinnersGenerated(address indexed lotteryId, uint256[] winnerTickets);
}