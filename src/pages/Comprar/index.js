import React, { useEffect,useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import smart_contract from '../../abis/LotteryService.json';
import { CONTRACT_ADDRESS } from "../../services/getEnvs";
import MyAlert from "../../components/MyAlert";

export default function Comprar({ params }) {
    const { lotteryAddress } = params;
    const { isWeb3Enabled} = useMoralis();
    const [numTicket, setNumTicket] = useState(0);
    const [numSerie, setNumSerie] = useState(0);
    const [numFraccion, setNumFraccion] = useState(0);
    const [numShares, setNumShares] = useState(0);
    const [entranceFee, setEntranceFee] = useState(null);
    const [alert, setAlert] = useState(null);

    const {runContractFunction: buyTicket } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "buyTicket",
        msgValue: entranceFee,
        params: {
            _lotteryId: lotteryAddress,
            _numTicket: numTicket,
            _numSerie: numSerie,
            _numFraccion: numFraccion,
            _totalShares: numShares
        },
    })

    const { runContractFunction: getLotteryInfo } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS, 
        functionName: "getLottery",
        params: { _lotteryId: lotteryAddress },
    })

    const { runContractFunction: getLatestPrice } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS, 
        functionName: "getLatestPrice"
    })



    const handleComprar = async (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            await buyTicket({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            getLotteryInfo().then((_lotteryInfo) => {
                getLatestPrice().then((price) => {
                    setEntranceFee((parseInt(_lotteryInfo[4]._hex,16) * 10 **26 / parseInt(price._hex,16))+100);
                });
            });
        }
    }, [isWeb3Enabled]);

    return (
        <>
            <div className="comprarPage">
                <div className="comprarHeader"> 
                    <h1>Comprar</h1>
                </div>
                <form id="comprarForm" onSubmit={handleComprar}>
                    <div className="comprarFormGroup">
                        <div className="comprarFormInput">
                            <label htmlFor="numBoleto">Número de boleto</label>
                            <input type="number" className="comprarFormControl" id="numBoleto" onChange={(e) => {setNumTicket(e.target.value)}} min="0"  placeholder="0" />
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="numSerie">Número de serie</label>
                            <input type="number" className="comprarFormControl" id="numSerie" onChange={(e) => {setNumSerie(e.target.value)}} min="0" placeholder="0" />
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="numFraccion">Fracción</label>
                            <input type="number" className="comprarFormControl" id="numFraccion" onChange={(e) => {setNumFraccion(e.target.value)}} min="0" max="9" placeholder="0" />
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="numShares">Cantidad de participaciones</label>
                            <input type="number" className="comprarFormControl" id="numShares" onChange={(e) => {setNumShares(e.target.value)}} min="1"  placeholder="100" />
                        </div>
                        <div className="comprarFormInput">
                            <button type="submit" className="comprarFormButton">Comprar</button>
                        </div>
                    </div>
                </form>
            </div>
        {alert && (<MyAlert message={alert.message} severity={alert.severity} />)}
        </>
    );
}