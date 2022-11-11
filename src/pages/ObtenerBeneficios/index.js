import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { CONTRACT_ADDRESS } from '../../services/getEnvs';
import smart_contract from '../../abis/LotteryService.json';
import Web3 from 'web3';
import MyAlert from '../../components/MyAlert';

export default function ObtenerBeneficios() {

    const {Moralis,isWeb3Enabled} = useMoralis();
    const [balance, setBalance] = useState(0);
    const [alert, setAlert] = useState(null);

    const { runContractFunction: withdraw } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "withdraw"
    });

    const handleObtenerBeneficios = () => {
        if (isWeb3Enabled) {
            console.log("withdraw");
            withdraw({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            const provider = new Web3(Moralis.provider);
            provider.eth.getBalance(CONTRACT_ADDRESS).then((_balance) => {
                setBalance(provider.utils.fromWei(_balance, 'ether'));
            });
        }
    }, [isWeb3Enabled]);

    return (
        <>
            <div className="obtenerBeneficiosPage">
                <div className="obtenerBeneficiosHeader"> 
                    <h1>Obtener Beneficios</h1>
                    <span>Balance: {balance} ETH</span>
                </div>
                <div className="obtenerBeneficiosButton">
                    <button onClick={handleObtenerBeneficios}>Obtener Beneficios</button>
                </div>
            </div>
            {alert && (<MyAlert message={alert.message} severity={alert.severity} />)}
        </>
    );
}