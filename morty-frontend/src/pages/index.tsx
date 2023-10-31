
import Layout from '@/layout'
import Welcome from '@/components/Welcome'
import Dashboard from '@/components/Dashboard'
import Shops from '@/components/Shops'
import { TabsProvider } from '@/context/TabsContext'



export default function Home() {
  return (

    <>
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
