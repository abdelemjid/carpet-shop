import { useQuery } from "@tanstack/react-query";
import StatsSection from "@/components/home/StatsSection";
import LineChartView from "@/components/home/LineChartView";
import { useEffect } from "react";
import { ApiClient } from "@/utils/ApiClient";
import { useHomeFilterContext } from "@/contexts/home/HomeFilterContext";
import HomeFilters from "@/components/home/HomeFilters";

const HomePage = () => {
  const { fromDate, setFromDate, toDate, setToDate, clearFilter } =
    useHomeFilterContext();

  const statsFilter = {
    start: fromDate?.toISOString(),
    end: toDate?.toISOString(),
  };

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["stats", statsFilter],
    queryFn: () => ApiClient.fetchStats(statsFilter),
  });

  const { data: daily, refetch: refetchDaily } = useQuery({
    queryKey: ["daily", statsFilter],
    queryFn: () => ApiClient.fetchDailyStats(statsFilter),
  });

  useEffect(() => {
    const now = new Date();

    setFromDate(new Date(now.getFullYear(), now.getMonth(), 0));
    setToDate(now);
  }, []);

  useEffect(() => {
    refetchStats();
    refetchDaily();
  }, [fromDate, toDate]);

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <HomeFilters
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        clearFilter={clearFilter}
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
