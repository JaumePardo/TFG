import React,{useState,useEffect} from "react";
import { useMoralis,useWeb3Contract } from "react-moralis";
import lottery_contract from '../../abis/Lottery.json';
import smart_contract from '../../abis/LotteryService.json';
import Web3 from 'web3';
import { CONTRACT_ADDRESS } from "../../services/getEnvs";
import MyAlert from "../../components/MyAlert";



export default function Deploy() {

    const {Moralis, isWeb3Enabled, account} = useMoralis();
    const [totalNumbers, setTotalNumbers] = useState(0);
    const [totalSeries, setTotalSeries] = useState(0);
    const [ticketCost, setTicketCost] = useState(0);
    const [prize, setPrize] = useState(0);
    const [nameLottery, setNameLottery] = useState("");
    const [minimumParticipants, setMinimumParticipants] = useState(0);
    const [numWinners, setNumWinners] = useState(0);
    const [dateLottery, setDateLottery] = useState(0);
    const [lotteryAddress, setLotteryAddress] = useState(null);
    const [web3js, setWeb3js] = useState(null);
    const [alert, setAlert] = useState(null);


    const deployLottery = async () => {
        const undeployedLottery = new web3js.eth.Contract(lottery_contract.abi);
        try{
            const deployedLottery = await undeployedLottery.deploy({
                data: lottery_contract.bytecode,
                arguments : [ticketCost,totalNumbers,totalSeries,CONTRACT_ADDRESS,minimumParticipants,prize,numWinners,dateLottery,nameLottery]
            }).send({
                from: account,
                gas: 9635081,
                gasPrice: '2500000000',
                value: prize
            });
            setLotteryAddress(deployedLottery._address);
        }catch(e){
            setAlert({ message: error.message, severity: "error" });
        }
    }

    const {runContractFunction: addLottery} = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "addLottery",
        params: {
            _lotteryContract: lotteryAddress,
        },
    })

    const handleDeploy = (e) => {
        e.preventDefault();
        if (isWeb3Enabled) {
            deployLottery().catch((error) => {
                setAlert({ message: error.message, severity: "error" });
            });
        }

    }

    useEffect(() => {
        if (isWeb3Enabled && lotteryAddress) {
            setAlert({ message: `La loter??a con address ${lotteryAddress} se ha desplegado correctamente. 
            Se proceder?? a guardarlo dentro del almac??n de loter??as`, severity: "success" });
            console.log("a??adiendo lottery");
            addLottery({onError: (error) => {
                setAlert({severity: "error", message: error.error.message})
                }
            })
        }
    }, [lotteryAddress]);



    useEffect(() => {
        if (isWeb3Enabled) {
            Moralis.enableWeb3().then(() => {
                const provider = new Web3(Moralis.provider);
                setWeb3js(new Web3(Moralis.provider));
            });
        }
    }, [isWeb3Enabled]);


    return (
        <>
            <div className="desplegarPage">
                <div className="desplegarHeader"> 
                    <h1>Desplegar Loter??a</h1>
                </div>
                <form id="comprarForm" onSubmit={handleDeploy}>
                    <div className="comprarFormGroup">
                    <div className="comprarFormInput">
                            <label htmlFor="nameLottery">Nombre</label>
                            <input type="text" className="comprarFormControl" id="nameLottery" onChange={(e) => {setNameLottery(e.target.value)}} placeholder="Loter??a de Navidad 2022"/>
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="totalNumbers">Cantidad de n??meros</label>
                            <input type="number" className="comprarFormControl" id="totalNumbers" onChange={(e) => {setTotalNumbers(e.target.value)}} placeholder="100000"/>
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="totalSeries">Cantidad de series</label>
                            <input type="number" className="comprarFormControl" id="totalSeries" onChange={(e) => {setTotalSeries(e.target.value)}} placeholder="172"/>
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="ticketCost">Precio por boleto (USD)</label>
                            <input type="number" className="comprarFormControl" id="ticketCost" onChange={(e) => {setTicketCost(e.target.value)}}  placeholder="20"/>
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="minimumParticipants">Cantidad m??nima de jugadores</label>
                            <input type="number" className="comprarFormControl" id="minimumParticipants" onChange={(e) => {setMinimumParticipants(e.target.value)}}  placeholder="150"/>
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="numWinners">N??mero de ganadores</label>
                            <input type="number" className="comprarFormControl" id="numWinners" onChange={(e) => {setNumWinners(e.target.value)}}  placeholder="1"/>
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="dateLottery">Finalizaci??n de la loter??a</label>
                            <input type="datetime-local" className="comprarFormControl" id="dateLottery" onChange={(e) => {setDateLottery(new Date(e.target.value).getTime()/1000)}}  />
                        </div>
                        <div className="comprarFormInput">
                            <label htmlFor="prize">Premio total (Wei)</label>
                            <input type="number" className="comprarFormControl" id="prize" onChange={(e) => {setPrize(e.target.value)}} placeholder="500000000000000"/>
                        </div>
                        <div className="comprarFormInput">
                            <button type="submit" className="comprarFormButton">Crear Loteria</button>
                        </div>
                    </div>
                </form>
            </div>
            {alert && (<MyAlert message={alert.message} severity={alert.severity} />)}
        </>
    )
}