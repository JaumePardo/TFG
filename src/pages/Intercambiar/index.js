import React from "react";
import { useEffect,useState } from "react";
import { useMoralis,useWeb3Contract } from "react-moralis";
import smart_contract from "../../abis/LotteryService.json";
import { CONTRACT_ADDRESS } from "../../services/getEnvs";
import MyAlert from "../../components/MyAlert";


export default function Intercambiar({params}) {
    const { lotteryAddress } = params;
    const { isWeb3Enabled} = useMoralis();
    const [tokenId, setTokenId] = useState(null);
    const [numTicket, setNumTicket] = useState(0);
    const [numSerie, setNumSerie] = useState(0);
    const [numFraccion, setNumFraccion] = useState(0);
    const [address, setAddress] = useState(null);
    const [amount, setAmount] = useState(0);
    const [entranceFee, setEntranceFee] = useState(0);
    const [alert, setAlert] = useState(null);
    const [comprar, setComprar] = useState(false);


    const {runContractFunction: allowBuyShares} = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "allowBuyShares",
        params: {
            _lotteryId: lotteryAddress,
            _to: address,
            _amount: amount,
            _tokenId: tokenId
        },
    })

    const { runContractFunction: buyShares } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "buyShares",
        msgValue: entranceFee,
        params: {
            _lotteryId: lotteryAddress,
            _from: address,
            _tokenId:  tokenId
        }
    });

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
    
    const handleClickComprar = async (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            setComprar(true);
            const _tokenId = await getTokenId({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
            setTokenId(_tokenId);
        }
    }

    const handleClickVender = async (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            setComprar(false);
            const _tokenId = await getTokenId({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
            setTokenId(_tokenId);
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getLotteryInfo().then((_lotteryInfo) => {
                getLatestPrice().then((price) => {
                    setEntranceFee((parseInt(_lotteryInfo[4]._hex,16) * 10 **26 / parseInt(price._hex,16)));
                });
            });
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        tokenId && comprar && buyShares({onError: (error) => {
            setAlert({severity: "error", message: error.error.message})
            }
        })
        tokenId && !comprar && allowBuyShares({onError: (error) => {
            setAlert({severity: "error", message: error.error.message})
            }
        })
      }, [tokenId]);

    
    
    return (
        <>
            <div className="intercambiarPage">
                <div className="intercambiarHeader">
                    <h1>Compartir</h1>
                </div>
                <form id="intercambiarForm">
                    <div className="intercambiarFormGroup">
                        <label htmlFor="addressIntercambiar">Dirección a la que compartir boletos</label>
                        <input type="text" id="addressIntercambiar" onChange={(e)=>{setAddress(e.target.value)}} placeholder="0x0..."  />
                    </div>
                    <div className="intercambiarFormGroup">
                        <label htmlFor="numBoleto">Número de boleto</label>
                        <input type="number" className="comprarFormControl" id="numBoleto" onChange={(e) => {setNumTicket(e.target.value)}} min="0" placeholder="0" />
                    </div>
                    <div className="intercambiarFormGroup">
                        <label htmlFor="numSerie">Número de serie</label>
                        <input type="number" className="comprarFormControl" id="numSerie" onChange={(e) => {setNumSerie(e.target.value)}} min="0" placeholder="0" />
                    </div>
                    <div className="intercambiarFormGroup">
                        <label htmlFor="numFraccion">Fracción</label>
                        <input type="number" className="comprarFormControl" id="numFraccion" onChange={(e) => {setNumFraccion(e.target.value)}} min="0" max="9" placeholder="0" />
                    </div>
                    <div className="intercambiarFormGroup">
                        <label htmlFor="cantidadIntercambiar">Cantidad de participaciones a compartir</label>
                        <input type="number" id="cantidadIntercambiar" onChange={(e)=>{setAmount(e.target.value)}} placeholder="50"/>
                    </div>
                    <div className="intercambiarFormButtons">
                        <button onClick={handleClickComprar}>Comprar</button>
                        <button onClick={handleClickVender}>Vender</button>
                    </div>
                </form>
            </div>
            {alert && (<MyAlert message={alert.message} severity={alert.severity} />)}
        </>
    );
    }  