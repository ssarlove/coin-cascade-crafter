import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect {address?.slice(0, 6)}…{address?.slice(-4)}
      </button>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
    >
      {isPending ? 'Connecting…' : 'Connect Wallet'}
    </button>
  )
}
