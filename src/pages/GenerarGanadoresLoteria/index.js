import React, { useEffect,useState } from "react";
import { useMoralis, useWeb3Contract, useApiContract } from "react-moralis";
import smart_contract from '../../abis/LotteryService.json';
import { CONTRACT_ADDRESS } from "../../services/getEnvs";
import MyAlert from "../../components/MyAlert";

export default function GenerarGanadoresLoteria({ params }) {
    const { lotteryAddress } = params;
    const { isWeb3Enabled } = useMoralis();
    const [alert, setAlert] = useState(null);


    const { runContractFunction: generateWinners } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "generateWinners",
        params: {
            _lotteryId: lotteryAddress
        },
    });

    const { runContractFunction: setWinningTickets } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "setWinningTickets",
        params: {
            _lotteryId: lotteryAddress
        },
    });


    const handleClickGenerateWinners = async () => {
        if (isWeb3Enabled) {
            generateWinners({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }

    const handleClickSetWinningTickets = async () => {
        if (isWeb3Enabled) {
            console.log("set winning tickets");
            setWinningTickets({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }        

    return (
        <>
            <div className="generarGanadoresPage">
                <div className="generarGanadoresHeader">
                    <h1>Generar Ganadores</h1>
                </div>
                <div className="generarGanadoresButtons">
                    <button onClick={handleClickGenerateWinners}>Generar Números</button>
                    <button onClick={handleClickSetWinningTickets}>Asignar Boletos Ganadores</button>
                </div>
            </div>
            {alert && (<MyAlert message={alert.message} severity={alert.severity} />)}
        </>
    );
}