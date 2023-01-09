import React from "react";
import LastLotteries from "../../components/LastLotteries";
    
    
export default function HomePage({params}) {
    let {redirectTo} = params;
    redirectTo = redirectTo || "comprar";
    return <>
    <div className="homePage">
        <LastLotteries redirectTo={redirectTo} />
    </div>
    </>
}