import { useQuery } from "@tanstack/react-query";
import * as apiClient from "@/apiClient";
import StatsSection from "@/components/home/StatsSection";
import LineChartView from "@/components/home/LineChartView";
import { useEffect, useState } from "react";
import DateFilter from "@/components/home/DateFilter";

const HomePage = () => {
  const now = new Date();
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const statsFilter = {
    start: fromDate?.toISOString(),
    end: toDate?.toISOString(),
  };

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["stats", statsFilter],
    queryFn: () => apiClient.fetchStats(statsFilter),
  });

  const { data: daily, refetch: refetchDaily } = useQuery({
    queryKey: ["daily", statsFilter],
    queryFn: () => apiClient.fetchDailyStats(statsFilter),
  });

  useEffect(() => {
    refetchStats();
    refetchDaily();
  }, [fromDate, toDate]);

  return (
    <div className="flex flex-col gap-5">
      {/* Date Filter */}
      <DateFilter
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />
      {/* Stats Cards */}
      <StatsSection stats={stats} />
      {/* Stats Lines Chart */}
      <LineChartView
        data={daily}
        from={statsFilter.start?.split("T")[0]}
        to={statsFilter.end?.split("T")[0]}
      />
    </div>
  );
};

export default HomePage;
