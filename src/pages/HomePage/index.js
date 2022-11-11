import React from "react";
import LastLotteries from "../../components/LastLotteries";
    
    
export default function HomePage() {
    return <>
    <div className="homePage">
        <LastLotteries redirectTo={"comprar"} />
    </div>
    </>
}