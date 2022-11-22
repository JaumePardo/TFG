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
    uint32 private numWinners;
    uint256 private minimumParticipants;
    uint256 private prizeNotClaimed;
    uint256 private date;


    uint256[] private purchasedTickets;

    mapping(uint256 => share) private ticketToShare;

    uint256[] private winnerTickets;
    mapping(uint256 => bool) private winnerTicketsMap;


    address private owner;

    States private state;
    enum States {
        LotteryActive,
        LotteryFinished,
        LotteryFailed
    }

    struct share {
        uint256 tokenId;
        address shares;
    }

    constructor(
        uint256 _ticketCost,
        uint256 _totalNumbers,
        uint256 _totalSeries,
        address _owner,
        uint256 _minimumParticipants,
        uint256 _totalPrize,
        uint32 _numWinners,
        uint256 _date,
        string memory _lotteryName
    ) payable ERC721(_lotteryName, _lotteryName) {
        require(msg.value == _totalPrize,"Necesitas enviar mas ETH para el premio");
        require( _ticketCost > 0,"El coste de cada ticket tiene que ser superior a 0");
        require( _totalNumbers > 0,"El total de numeros tiene que ser superior a 0");
        require( _totalSeries > 0,"El total de series tiene que ser superior a 0");
        require( _minimumParticipants > 0,"El numero minimo de participantes tiene que ser superior a 0");
        require( _numWinners > 0,"El numero de ganadores tiene que ser superior a 0");
        require( _date > block.timestamp,"La fecha tiene que ser superior a la actual");
        require( _totalPrize > 0,"El premio total tiene que ser superior a 0");
        totalPrize = _totalPrize;
        prizeNotClaimed = _totalPrize;
        numWinners = _numWinners;
        ticketCost = _ticketCost;
        totalNumbers = _totalNumbers;
        totalSeries = _totalSeries;
        owner = _owner;
        minimumParticipants = _minimumParticipants;
        state = States.LotteryActive;
        date = _date;
        lotteryName = _lotteryName;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function getBenefits(address _to) public onlyOwner {
        uint256 profit = address(this).balance - prizeNotClaimed;
        require(profit > 0, "No hay beneficios");
        (bool success,)=payable(_to).call{value:profit}("");
        require(success, "Transfer failed");
    }

    function payPrize(uint256 _weiToPay, address _to) public onlyOwner {
        (bool success,)=payable(_to).call{value:_weiToPay}("");
        require(success, "Transfer failed");
        prizeNotClaimed = prizeNotClaimed - _weiToPay;
    }

    function mintBoleto(
        address _to,
        uint256 _tokenId,
        uint256 _totalShares
    ) public onlyOwner {
        _safeMint(_to, _tokenId);
        Shares _shares = new Shares(_to, _totalShares, owner);
        ticketToShare[_tokenId] = share(_tokenId, address(_shares));
        purchasedTickets.push(_tokenId);
    }

    function infoLottery()
        public
        view
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
        return (
            lotteryName,
            date,
            owner,
            totalNumbers,
            totalSeries,
            ticketCost,
            minimumParticipants,
            totalPrize,
            numWinners,
            winnerTickets
        );
    }

    // function setRequestId(uint32 _requestId) public onlyOwner {
    //     requestId = _requestId;
    // }

    // function getRequestId() public view returns (uint32) {
    //     return requestId;
    // }

    fallback() external payable {}
    receive() external payable {}


    function setLotteryFinished() public onlyOwner {
        state = States.LotteryFinished;
    }

    function setLotteryFailed() public onlyOwner {
        state = States.LotteryFailed;
    }

    function isLotteryFinished() public view returns (bool) {
        return state == States.LotteryFinished;
    }

    function isLotteryFailed() public view returns (bool) {
        return state == States.LotteryFailed;
    }

    function getTotalPurchasedTickets() public view returns (uint256) {
        return purchasedTickets.length;
    }

    function setWinnerTickets( uint256[] memory randomWords) external onlyOwner returns(uint256[] memory){
        for (uint256 i = 0; i < randomWords.length; i++) {
            uint256 winnerTicket = purchasedTickets[randomWords[i]%purchasedTickets.length];
            winnerTickets.push(winnerTicket);
            winnerTicketsMap[winnerTicket] = true; 
            removePurchasedTicket(randomWords[i]%purchasedTickets.length);
        }
        return winnerTickets;
    }

    function removePurchasedTicket(uint256 _index) internal{
        purchasedTickets[_index] = purchasedTickets[purchasedTickets.length - 1];
        purchasedTickets.pop();
    }

    function getPrizeLottery() public view returns (uint256) {
        return totalPrize / winnerTickets.length;
    }

    function isWinnerTicket(uint256 _tokenId) public view returns (bool) {
        return winnerTicketsMap[_tokenId];
    }

    function getTicketToShare(uint256 _tokenId) public view returns (share memory) {
        return ticketToShare[_tokenId];
    }
}
