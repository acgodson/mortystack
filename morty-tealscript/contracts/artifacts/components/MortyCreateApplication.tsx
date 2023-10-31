/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Morty, MortyClient } from '../../clients/MortyClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MortyCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  proposal={proposal}
/>
*/
type MortyCreateApplicationArgs = Morty['methods']['createApplication()void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MortyClient
  proposal: MortyCreateApplicationArgs[]
}

const MortyCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {
        proposal: props.proposal,
      },
      { sender },
    )
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default MortyCreateApplication

