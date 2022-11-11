// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./LotteryStorage.sol";
import "./Lottery.sol";
import "./Shares.sol";
import "./PriceConsumer.sol";
import "./RNGChainlinkV2.sol";

contract LotteryService is RNGChainlinkV2, PriceConsumerV3 {
    LotteryStorage lotteryStorage;

    address private _owner;

    constructor(uint64 subscriptionId) RNGChainlinkV2(subscriptionId) {
        _owner = msg.sender;
        lotteryStorage = new LotteryStorage();
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    modifier lotteryExists(address addressLottery) {
        require(
            lotteryStorage.lotteryExists(addressLottery),
            "La loteria no existe"
        );
        _;
    }

    function checkNumBoleto(
        uint256 numTicket,
        uint256 numSerie,
        uint256 numFraccion,
        uint256 totalNumbers,
        uint256 totalSeries
    ) internal pure returns (bool) {
        return
            (numTicket >= 0) &&
            (numTicket < totalNumbers) &&
            (numSerie >= 0) &&
            (numSerie < totalSeries) &&
            (numFraccion >= 0) &&
            (numFraccion < 10);
    }

    function getCostEth(uint256 ticketCost) public view returns (uint256) {
       return ((ticketCost * 10**26) / getLatestPrice());
    }

    function addLottery(address _lotteryContract) public onlyOwner {
        lotteryStorage.setLottery(_lotteryContract);
        emit lotteryAdded(_lotteryContract);
    }

    function withdraw() public onlyOwner {
        payable(_owner).transfer(address(this).balance);
    }

    function generateWinners(address _lotteryId)
        public
        onlyOwner
        lotteryExists(_lotteryId)
        returns (uint256)
    {
        Lottery ticket = Lottery(_lotteryId);
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        require(ticket.getTotalPurchasedTickets()>2,"Debe haber minimo 3 boletos comprados");
        (uint32 requestId, ) = requestRandomNumber();
        ticket.setRequestId(requestId);
        ticket.setLotteryFinished();
        return requestId;
    }

    function setWinningTickets(address _lotteryId) public onlyOwner lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(ticket.isLotteryFinished(), "La loteria aun no ha terminado");
        uint32 requestId = ticket.getRequestId();
        require(isRequestComplete(requestId),"Los numeros aleatorios aun no se han generado");
        (uint256 randNum1, uint256 randNum2, uint256 randNum3) = randomNumber(requestId);
        uint256 totalPurchasedTickets = ticket.getTotalPurchasedTickets();
        ticket.setWinnerTickets(
            (randNum1 % totalPurchasedTickets),
            (randNum2 % totalPurchasedTickets),
            (randNum3 % totalPurchasedTickets)
        );
    }

    function getPrize(address _lotteryId, uint256 _tokenId) public lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(ticket.isLotteryFinished(), "La loteria aun no ha terminado");
        require(ticket.isWinnerTicket(_tokenId), "Este ticket no tiene premio");
        uint256 amountShares = getSharesOfBuyer(
            _lotteryId,
            msg.sender,
            _tokenId
        );
        require(amountShares != 0, "No tiene participaciones de este ticket");
        uint256 totalSupplyShares = getTotalSupplyShares(_lotteryId, _tokenId);
        ticket.payPrize(
            (amountShares * ticket.getPrizeLottery()) / totalSupplyShares,
            msg.sender
        );
        Shares share = Shares(ticket.getTicketToShare(_tokenId).shares);
        share.burn(msg.sender, amountShares);
        emit prizeReceived(_lotteryId, _tokenId);
    }

    function buyTicket(
        address _lotteryId,
        uint256 _numTicket,
        uint256 _numSerie,
        uint256 _numFraccion,
        uint256 _totalShares
    ) public payable lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(_totalShares>0, "Debes adquirir mas de una participacion");
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        (,,uint256 totalNumbers,uint256 totalSeries,uint256 ticketCost,) = ticket.infoLottery();
        require(checkNumBoleto(_numTicket,_numSerie,_numFraccion,totalNumbers,totalSeries),"El numero,serie o fraccion no son correctos");
        uint256 ticketCostEth = getCostEth(ticketCost);
        require(msg.value >= ticketCostEth,"Necesitas mas ETH para comprar un ticket");
        uint256 refund = msg.value - ticketCostEth;
        payable(msg.sender).transfer(refund);
        uint256 tokenId = getTokenId(_lotteryId,_numTicket, _numSerie, _numFraccion);
        ticket.mintBoleto(msg.sender, tokenId, _totalShares);
        emit ticketBought(_lotteryId, tokenId, _totalShares);
    }

    function allowBuyShares(
        address _lotteryId,
        address _to,
        uint256 _amount,
        uint256 _tokenId
    ) public lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        Shares share = Shares(ticket.getTicketToShare(_tokenId).shares);

        require(share.balanceOf(msg.sender) >= _amount,"No tienes suficientes participaciones de este ticket");
        share.approve(msg.sender, _to, _amount);
    }

    function buyShares(
        address _lotteryId,
        address _from,
        uint256 _tokenId
    ) public payable lotteryExists(_lotteryId) {
        Lottery ticket = Lottery(_lotteryId);
        require(!ticket.isLotteryFinished(), "La loteria ya ha terminado");
        Shares share = Shares(ticket.getTicketToShare(_tokenId).shares);
        (, , , , uint256 ticketCost, ) = Lottery(_lotteryId).infoLottery();
        uint256 amount = share.allowance(_from, msg.sender);
        require(0 < amount, "No tienes permiso para comprar participaciones");
        uint256 costOfShares = ((amount * getCostEth(ticketCost)) /
            share.totalSupply());
        require(
            msg.value >= costOfShares,
            "Necesitas mas ETH para comprar las participaciones"
        );
        payable(_from).transfer(costOfShares);
        share.transferFrom(_from, msg.sender, amount);
        emit sharesBought(_lotteryId,_from, _tokenId, amount);
    }

    function getSharesOfBuyer(
        address _lotteryId,
        address _to,
        uint256 _tokenId
    ) public view lotteryExists(_lotteryId) returns (uint256) {
        address addressShare = Lottery(_lotteryId)
            .getTicketToShare(_tokenId)
            .shares;
        require(addressShare != address(0), "El ticket no ha sido comprado");
        return Shares(addressShare).balanceOf(_to);
    }

    function getTotalSupplyShares(address _lotteryId, uint256 _tokenId)
        public
        view
        lotteryExists(_lotteryId)
        returns (uint256)
    {
        address addressShare = Lottery(_lotteryId)
            .getTicketToShare(_tokenId)
            .shares;
        require(addressShare != address(0), "El ticket no ha sido comprado");
        return Shares(addressShare).totalSupply();
    }

    function getLotteries() public view returns (address[] memory) {
        return lotteryStorage.getLotteries();
    }

    function getLottery(address _lotteryId)
        public
        view
        lotteryExists(_lotteryId)
        returns (
            string memory,
            address,
            uint256,
            uint256,
            uint256,
            uint256[3] memory
        )
    {
        return (Lottery(_lotteryId).infoLottery());
    }

    function getTokenId(
        address _lotteryId,
        uint256 _numTicket,
        uint256 _numSerie,
        uint256 _numFraccion
    ) public view lotteryExists(_lotteryId) returns (uint256) {
        Lottery ticket = Lottery(_lotteryId);
        (, , , uint256 totalSeries, , ) = ticket.infoLottery();
        return (_numTicket * (totalSeries * 10)) + (_numSerie * 10) + _numFraccion;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    event lotteryAdded(address _lotteryContract);
    event ticketBought(
        address _lotteryId,
        uint256 tokenId,
        uint256 _totalShares
    );
    event prizeReceived(address _lotteryId, uint256 _tokenId);
    event ticketAllowedToBuy(
        address _lotteryId,
        address _to,
        uint256 _tokenId,
        uint256 _amount
    );
    event sharesBought(
        address _lotteryId,
        address _from,
        uint256 _tokenId,
        uint256 _amount
    );
}
