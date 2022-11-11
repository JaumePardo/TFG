import smart_contract from '../../abis/LotteryService.json';
import { useMoralis, useWeb3Contract } from "react-moralis";


export default function getLotteryInfo(lotteryAddress) {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const { runContractFunction: getLotteryInfo } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: contractAddress, // specify the networkId
        functionName: "getLottery",
        params: {_lotteryId: lotteryAddress},
    })
    return getLotteryInfo();
}