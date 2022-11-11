import { useEffect } from "react"
import { useMoralis } from "react-moralis"

export default function ManualHeader() {
    const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } =useMoralis()

    useEffect(() => {
        if (
            !isWeb3Enabled &&
            typeof window !== "undefined" &&
            window.localStorage.getItem("connected")
        ) {
            enableWeb3()
        }
    }, [isWeb3Enabled])
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <nav className="connectDiv">
                    {account ? (
                        <div className="ml-auto py-2 px-4">
                            Connected to <br/>{account.slice(0, 6)}...
                            {account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                // await walletModal.connect()
                                await enableWeb3()
                                // depends on what button they picked
                                if (typeof window !== "undefined") {
                                    window.localStorage.setItem("connected", "injected")
                                    // window.localStorage.setItem("connected", "walletconnect")
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        >
                            Connect
                        </button>
                    )}
        </nav>
    )
}