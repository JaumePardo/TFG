import React, { useEffect, useState } from "react";
import getLastLotteries from "../../services/getLastLotteries";
import LotteryIcon from "../../components/LotteryIcon";
import smart_contract from "../../abis/LotteryService.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { CONTRACT_ADDRESS } from "../../services/getEnvs";

export default function LastLotteries({ redirectTo }) {
  const [lastLotteries, setLastLotteries] = useState([]);
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();

  const { runContractFunction: getLotteries } = useWeb3Contract({
    abi: smart_contract.abi,
    contractAddress: CONTRACT_ADDRESS, // specify the networkId
    functionName: "getLotteries",
    params: {},
  });

  function updateUIValues() {
    getLotteries()
      .then((lotteries) => {
        setLastLotteries(lotteries);
        console.log(lotteries);
        console.log(CONTRACT_ADDRESS);
        console.log(smart_contract.abi);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <h1>Últimas loterías</h1>
      <ul className="listLotteries">
        {lastLotteries &&
          lastLotteries.map((lottery) => {
            return (
              <li key={lottery}>
                <LotteryIcon lotteryAddress={lottery} redirectTo={redirectTo} />
              </li>
            );
          })}
      </ul>
    </>
  );
}
