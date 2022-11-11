// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Shares.sol";


contract Lottery is ERC721 {
    uint256 private totalNumbers;
    uint256 private totalSeries;
    uint256 private ticketCost;
    uint256 private totalPrize;
    string private lotteryName;

    uint32 private requestId;

    uint256[] private purchasedTickets;

    mapping(uint256 => _share) private ticketToShare;

    uint256[3] private winnerTickets;
    mapping(uint256 => bool) private winnerTicketsMap;


    address owner;

    States state;
    enum States {
        LotteryActive,
        LotteryFinished
    }

    struct _share {
        uint256 tokenId;
        address shares;
    }

    constructor(
        uint256 _ticketCost,
        uint256 _totalNumbers,
        uint256 _totalSeries,
        address _owner,
        uint256 _totalPrize,
        string memory _lotteryName
    ) payable ERC721(_lotteryName, _lotteryName) {
        require(
            msg.value == _totalPrize,
            "Necesitas enviar mas ETH para el premio"
        );
        totalPrize = _totalPrize;
        require(
            _ticketCost > 0,
            "El coste de cada ticket tiene que ser superior a 0"
        );
        ticketCost = _ticketCost;
        totalNumbers = _totalNumbers;
        totalSeries = _totalSeries;
        owner = _owner;
        state = States.LotteryActive;
        lotteryName = _lotteryName;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function payPrize(uint256 weiToPay, address _to) public onlyOwner {
        payable(_to).transfer(weiToPay);
    }

    function mintBoleto(
        address _to,
        uint256 _tokenId,
        uint256 _totalShares
    ) public onlyOwner {
        _safeMint(_to, _tokenId);
        Shares _shares = new Shares(_to, _totalShares, owner);
        ticketToShare[_tokenId] = _share(_tokenId, address(_shares));
        purchasedTickets.push(_tokenId);
    }

    function infoLottery()
        public
        view
        returns (
            string memory,
            address,
            uint256,
            uint256,
            uint256,
            uint256[3] memory
        )
    {
        return (
            lotteryName,
            owner,
            totalNumbers,
            totalSeries,
            ticketCost,
            winnerTickets
        );
    }

    function setRequestId(uint32 _requestId) public onlyOwner {
        requestId = _requestId;
    }

    function getRequestId() public view returns (uint32) {
        return requestId;
    }

    function setLotteryFinished() public onlyOwner {
        state = States.LotteryFinished;
    }

    function isLotteryFinished() public view returns (bool) {
        return state == States.LotteryFinished;
    }

    function getTotalPurchasedTickets() public view returns (uint256) {
        return purchasedTickets.length;
    }

    function setWinnerTickets(
        uint256 numBoleto1,
        uint256 numBoleto2,
        uint256 numBoleto3
    ) public onlyOwner {
        winnerTickets[0] = purchasedTickets[numBoleto1];
        winnerTickets[1] = purchasedTickets[numBoleto2];
        winnerTickets[2] = purchasedTickets[numBoleto3];
        winnerTicketsMap[purchasedTickets[numBoleto1]] = true;
        winnerTicketsMap[purchasedTickets[numBoleto2]] = true;
        winnerTicketsMap[purchasedTickets[numBoleto3]] = true;
    }

    function getPrizeLottery() public view returns (uint256) {
        return totalPrize / winnerTickets.length;
    }

    function isWinnerTicket(uint256 _tokenId) public view returns (bool) {
        return winnerTicketsMap[_tokenId];
    }

    function getTicketToShare(uint256 _tokenId)
        public
        view
        returns (_share memory)
    {
        return ticketToShare[_tokenId];
    }
}
