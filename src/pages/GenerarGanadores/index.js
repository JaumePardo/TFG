import React from "react";
import LastLotteries from "../../components/LastLotteries";
import SearchLotteries from "../../components/SearchLotteries";
    
    
export default function Intercambiar() {
    return <>
    <div className="homePage">
        <LastLotteries redirectTo={"generarGanadoresLoteria"} />
    </div>
    </>
}