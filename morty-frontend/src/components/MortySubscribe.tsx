/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Morty, MortyClient } from '../tsContracts/MortyClient'
import { useWallet } from '@txnlab/use-wallet'
import { Button } from '@chakra-ui/react'



/* Example usage
<MortySubscribe
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call subscribe"
  typedClient={typedClient}
  account={account}
/>
*/
type MortySubscribeArgs = Morty['methods']['subscribe(byte[32])uint64[2]']['argsObj']

type Props = {
  scheme: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MortyClient
  boxes: any[]
  account: MortySubscribeArgs['account']
}

const MortySubscribe = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling subscribe`)
    await props.typedClient.subscribe(
      {
        account: props.account,
      },
      {
        boxes: props.boxes,
        sender
      },
    )
    setLoading(false)
  }

  return (
    <Button
      isLoading={loading}
      colorScheme={props.scheme}
      onClick={callMethod}
    >
      {props.buttonNode}
    </Button>
  )
}

export default MortySubscribe