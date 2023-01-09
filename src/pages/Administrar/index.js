import React,{useState,useEffect} from "react";
import { useMoralis,useWeb3Contract } from "react-moralis";
import lottery_contract from '../../abis/Lottery.json';
import smart_contract from '../../abis/LotteryService.json';
import Web3 from 'web3';
import { CONTRACT_ADDRESS } from "../../services/getEnvs";
import MyAlert from "../../components/MyAlert";



export default function Administrar() {

    const {Moralis, isWeb3Enabled, account} = useMoralis();
    const [address, setAddress] = useState(null);
    const [alert, setAlert] = useState(null);


    const {runContractFunction: addAuthorized} = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "addAuthorized",
        params: {
            _address: address,
        },
    })
    const {runContractFunction: removeAuthorized} = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "removeAuthorized",
        params: {
            _address: address,
        },
    })

    const {runContractFunction: finishLotteries} = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "finishLotteries"
    })

    const handleClickEliminar = async (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            await removeAuthorized({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }

    const handleClickAnadir = async (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            await addAuthorized({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }

    const handleFinalizarLoterias = async (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            await finishLotteries({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }

    return (
        <>
            <div className="administrarPage">
                <div className="administrarHeader"> 
                    <h1>Administrar Loterias</h1>
                </div>
                <form id="administrarForm">
                    <div className="administrarFormGroup">
                        <label htmlFor="addressAdministrar">Dirección</label>
                        <input type="text" id="addressAdministrar" onChange={(e)=>{setAddress(e.target.value)}} placeholder="0x0..."  />
                    </div>
                    <div className="administrarFormButtons">
                        <button onClick={handleClickAnadir}>Añadir responsable</button>
                        <button onClick={handleClickEliminar}>Eliminar responsable</button>
                    </div>
                </form>
                <div className="finalizarLoteriasButton">
                    <button onClick={handleFinalizarLoterias}>Finalizar Loterias</button>
                </div>
            </div>
            {alert && (<MyAlert message={alert.message} severity={alert.severity} />)}
        </>
    )
}