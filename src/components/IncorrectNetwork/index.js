import { useState } from "react";


export default function IncorrectNetwork({ user }) {


  return (
    <>
      <div className="incorrectNetwork">
        <div>
        Por favor conecte su wallet a la red de Goerli, chainId = 5
        </div>
      </div>
    </>
  );
}
