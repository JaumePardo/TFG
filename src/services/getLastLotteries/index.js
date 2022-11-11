/*
  
export default function getLastLotteries() {
    return [
        {key: 1 ,name:"Sorteo de navidad", contractAddress: "0x0"},
        { key: 2, name: "Sorteo de el niño", contractAddress: "0x1" },
        { key: 3, name: "Sorteo de el niño", contractAddress: "0x1" },
        { key: 4, name: "Sorteo de el niño", contractAddress: "0x1" },
        { key: 5, name: "Sorteo de el niño", contractAddress: "0x1" },
        { key: 6, name: "Sorteo de el niño", contractAddress: "0x1" },
        { key: 7, name: "Sorteo de el niño", contractAddress: "0x1" },
        {key: 8,name:"Sorteo de el niño", contractAddress: "0x1"}
    ];
}*/
import smart_contract from '../../abis/LotteryService.json';
import { useMoralis, useWeb3Contract } from "react-moralis";
import React from 'react';


export default function getLastLotteries(lotteries) {
  //  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()

    const contractAddress = process.env.CONTRACT_ADDRESS;
    const { runContractFunction: getLotteries } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: contractAddress, // specify the networkId
        functionName: "getLotteries",
        params: {},
    })

    /*useEffect(() => {
        getLotteries();
    } , []);
        /*
    async function updateUIValues() {
        const lotteries = await getLotteries();
        console.log('getLotteries',lotteries);
        console.log('isWeb3Enabled', isWeb3Enabled);
        console.log('chainIdHex', chainIdHex);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    } , [isWeb3Enabled])
    */
    return [];
}
