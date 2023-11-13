/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Morty, MortyClient } from '../contracts/MortyClient'
import { useWallet } from '@txnlab/use-wallet'
import { Button } from '@chakra-ui/react'

/* Example usage
<MortyCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
/>
*/
type Props = {
  scheme: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MortyClient
}

const MortyCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {},
      { sender },
    )
    setLoading(false)
  }

  return (
    <Button
      isLoading={loading}
      colorScheme={props.scheme}
      onClick={callMethod}>
      {props.buttonNode}
    </Button>
  )
}

export default MortyCreateApplication