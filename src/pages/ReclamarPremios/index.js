import React from "react";
import LastLotteries from "../../components/LastLotteries";


export default function ReclamarPremios() {
    return (
        <>
            <div className="homePage">
                <LastLotteries redirectTo={"reclamarPremiosLoteria"} />
            </div>
        </>
    );
}