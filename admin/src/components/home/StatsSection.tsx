import StatsCard from "@/components/home/StatsCard";
import type { StatsResponseType } from "@/types/stats.type";
import { BanknoteArrowDown, Box, ShoppingCart, User } from "lucide-react";

interface Props {
  stats: StatsResponseType | null | undefined;
}

const StatsSection = ({ stats }: Props) => {
  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] gap-2 transition-all duration-200 ease-in-out">
      <StatsCard
        title="Users"
        subtitle={stats?.activeUsers.toString() || ""}
        icon={<User size={20} />}
      />
      <StatsCard
        title="Products"
        subtitle={stats?.totalProducts.toString() || ""}
        icon={<Box size={20} />}
      />
      <StatsCard
        title="Total Orders"
        subtitle={stats?.totalOrders.toString() || ""}
        icon={<ShoppingCart size={20} />}
      />
      <StatsCard
        title="Orders"
        subtitle={stats?.orderedProductsThisMonth.toString() || ""}
        icon={<ShoppingCart size={20} />}
      />
      <StatsCard
        title="Earnings"
        subtitle={`$${stats?.earningsThisMonth.toString()}` || ""}
        icon={<BanknoteArrowDown size={20} />}
      />
    </div>
  );
};

export default StatsSection;
