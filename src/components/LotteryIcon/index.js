import React, { useState,useEffect }  from "react";
import { Link } from "wouter";
import { useMoralis, useWeb3Contract } from "react-moralis";
import smart_contract from '../../abis/LotteryService.json';
import { CONTRACT_ADDRESS } from "../../services/getEnvs";

export default function LotteryIcon({ lotteryAddress, redirectTo }) {    
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const [lotteryInfo, setLotteryInfo] = useState([]);

    const { runContractFunction: getLotteryInfo } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS, // specify the networkId
        functionName: "getLottery",
        params: { _lotteryId: lotteryAddress },
    })
    useEffect(() => {
        if (isWeb3Enabled) {
            getLotteryInfo().then((lotteryInfo) => {
                setLotteryInfo(lotteryInfo);
                console.log(lotteryInfo);
            });
        }
    }, [isWeb3Enabled]);

    return (
        <Link to={`/${redirectTo}/${lotteryAddress}`}>
        <div className="lottery-icon">
            <span>{lotteryInfo[0]}</span>
        </div>
        </Link>
    );
}