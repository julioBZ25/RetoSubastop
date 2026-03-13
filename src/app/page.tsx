import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { InventoryDashboard } from '@/features/inventory/InventoryDashboard';

export default function Home() {
  return (
    <DashboardLayout>
      <InventoryDashboard />
    </DashboardLayout>
  );
}
