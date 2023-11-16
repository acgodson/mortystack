import { TabsProvider } from "@/contexts/TabContext/TabsContext";
import Layout from "@/layout";
import Welcome from "@/components/Welcome";
import Dashboard from "@/components/Dashboard";
import CreateShop from "@/components/CreateShop";

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
            <CreateShop />
          </Layout>
        </TabsProvider>
      </main>
    </>
  );
}
