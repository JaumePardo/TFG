import {useState,useEffect} from 'react';
import { Link } from 'wouter'
import ConnectButton from '../../components/ConnectButton/index.js'
import { useMoralis, useWeb3Contract  } from "react-moralis";
import smart_contract from '../../abis/LotteryService.json';
import { CONTRACT_ADDRESS } from '../../services/getEnvs.js';
import IncorrectNetwork from '../IncorrectNetwork/index.js';


export default function Header() {

    const { isWeb3Enabled, account, chainId: chainIdHex} = useMoralis();
    const [lotteryOwner, setLotteryOwner] = useState(null);

    const { runContractFunction: owner } = useWeb3Contract({
        abi: smart_contract.abi,
        contractAddress: CONTRACT_ADDRESS, // specify the networkId
        functionName: "owner"
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log(parseInt(chainIdHex,16))
            owner().then((owner) => {
              setLotteryOwner(owner.toLowerCase());
            });
        }
    }, [isWeb3Enabled]);

    return (
        <>
            {chainIdHex && parseInt(chainIdHex,16) !== 5 && <IncorrectNetwork />}
            <div className="headerBackground">
            </div>
            <header className="headerApp">
                <ConnectButton />
                <a href='/' className='logo'>LOTERIA NACIONAL</a>
                <div className='menu'>
                    <Link to="/">Comprar</Link>
                    <Link to="/intercambiar">Compartir</Link>
                    <Link to="/reclamarPremios">Reclamar Premios</Link>
                    {lotteryOwner === account  && <Link to="/generarGanadores"> Generar Ganadores</Link>}
                    {lotteryOwner === account  && <Link to="/deploy">Desplegar</Link>}
                    {lotteryOwner === account  && <Link to="/obtenerBeneficios">Obtener Beneficios</Link>}
                </div>
             </header>
        </>
    );
}