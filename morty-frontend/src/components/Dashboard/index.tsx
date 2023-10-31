
import SidePanel from './LeftPanel';
import DashboardContent from './DashboardContent';
import Dashboardlayout from '@/layout/DashboardLayout';


export default function Dashboard() {

    return (
        <Dashboardlayout

        >
            <SidePanel />
            <DashboardContent />
        </Dashboardlayout>
    )
}
