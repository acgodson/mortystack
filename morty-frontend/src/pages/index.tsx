
import { TabsProvider } from '@/contexts/TabContext/TabsContext'
import Layout from '@/layout'
import Welcome from '@/components/Welcome'
import Dashboard from '@/components/Dashboard'
import Shops from '@/components/Shops'

// import TransferBridge from '@/Wormhole'





export default function Home() {
  return (

    <>
      {/* <TransferBridge /> */}
      <main>
        <TabsProvider>
          <Layout>
            <Welcome />
            <Dashboard />
            <Shops />
          </Layout>
        </TabsProvider>
      </main>
    </>
  )
}
