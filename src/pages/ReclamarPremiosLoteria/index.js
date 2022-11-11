import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import smart_contract from "../../abis/LotteryService.json";
import { CONTRACT_ADDRESS } from "../../services/getEnvs";

export default function ReclamarPremiosLoteria({ params }) {
  const { lotteryAddress } = params;
  const { isWeb3Enabled } = useMoralis();
  const [numTicket, setNumTicket] = useState(0);
  const [numSerie, setNumSerie] = useState(0);
  const [numFraccion, setNumFraccion] = useState(0);
  const [tokenId, setTokenId] = useState(null);

  useEffect(() => {
    tokenId && getPrize({onError: (error) => {
      setAlert({severity: "error", message: error.error.message})
      }
  })
  }, [tokenId]);

  const { runContractFunction: getPrize } = useWeb3Contract({
    abi: smart_contract.abi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getPrize",
    params: {
      _lotteryId: lotteryAddress,
      _tokenId: tokenId,
    },
  });

  const { runContractFunction: getTokenId } = useWeb3Contract({
    abi: smart_contract.abi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getTokenId",
    params: {
      _lotteryId: lotteryAddress,
      _numTicket: numTicket,
      _numSerie: numSerie,
      _numFraccion: numFraccion,
    },
  });

  const reclamarPremio = async (e) => {
    e.preventDefault();
    if (isWeb3Enabled) {
      const _tokenId = await getTokenId();
      setTokenId(_tokenId);
    }
  };

  return (
    <div className="reclamarPremiosPage">
      <div className="reclamarPremiosHeader">
        <h1>Reclamar Premio</h1>
      </div>
      <form id="comprarForm" onSubmit={reclamarPremio}>
        <div className="comprarFormGroup">
          <div className="comprarFormInput">
            <label htmlFor="numTicket">Numero de boleto</label>
            <input
              type="number"
              className="comprarFormControl"
              id="numTicket"
              min="0"
              max="99999"
              placeholder="Numero de boleto"
              onChange={(e) => {
                setNumTicket(e.target.value);
              }}
            />
          </div>
          <div className="comprarFormInput">
            <label htmlFor="numSerie">Numero de serie</label>
            <input
              type="number"
              className="comprarFormControl"
              onChange={(e) => {
                setNumSerie(e.target.value);
              }}
              id="numSerie"
              min="0"
              max="171"
              placeholder="Numero de serie"
            />
          </div>
          <div className="comprarFormInput">
            <label htmlFor="numFraccion">Fracción</label>
            <input
              type="number"
              className="comprarFormControl"
              id="numFraccion"
              min="0"
              max="9"
              placeholder="Fracción"
              onChange={(e) => {
                setNumFraccion(e.target.value);
              }}
            />
          </div>
          <div className="comprarFormInput">
            <button type="submit" className="comprarFormButton">
              Reclamar Premio
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
