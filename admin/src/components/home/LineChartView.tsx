import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DailyStatsResponse } from "@/types/stats.type";

const chartConfigData = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface Props {
  data: DailyStatsResponse[] | null | undefined;
  from: string | undefined;
  to: string | undefined;
}

const calculatePercentage = (data: DailyStatsResponse[] | null | undefined) => {
  if (!data) {
    data = [
      { date: new Date().toISOString().split("T")[0], earnings: 0, orders: 0 },
    ];
  }

  // Sort by date first
  const sorted = data.sort((a, b) => {
    return (
      new Date(a.date?.split("-").reverse().join("-")).getMilliseconds() -
      new Date(b.date?.split("-").reverse().join("-")).getMilliseconds()
    );
  });

  // Compute total earnings
  let earningsAvg = 0;
  let ordersAvg = 0;

  sorted.map((item) => {
    earningsAvg += item.earnings;
    ordersAvg += item.orders;
  });

  earningsAvg = earningsAvg / sorted.length;
  ordersAvg = ordersAvg / sorted.length;

  const earningsPercent =
    ((earningsAvg - sorted[0].earnings) / sorted[0].earnings) * 100;
  const ordersPercent =
    ((ordersAvg - sorted[0].orders) / sorted[0].orders) * 100;

  return [earningsPercent, ordersPercent];
};

const LineChartView = ({ data, from, to }: Props) => {
  const [earningsPercent, ordersPercent] = calculatePercentage(data);

  return (
    <div className="min-h-[400px] flex flex-col md:flex-row justify-center md:items-center gap-5">
      {/* Chart of Earnings */}
      <Card className="flex-1 bg-transparent">
        <CardHeader>
          <CardTitle>Line Chart - Earnings</CardTitle>
          <CardDescription>{`${from ? from : ""} - ${
            to ? to : ""
          }`}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigData} className="max-h-[300px]">
            <LineChart
              accessibilityLayer
              data={data ? data : []}
              margin={{
                left: 0,
                right: 12,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { weekday: "short" });
                }}
              />
              <YAxis
                dataKey="earnings"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="earnings"
                type="monotone"
                stroke="var(--color-earnings)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                {`Earnings is Trending ${
                  earningsPercent >= 0 ? "up by" : "down by"
                } ${earningsPercent.toFixed(1)}%`}
                {earningsPercent >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                {`Showing earnings trending ${
                  from ? "from " : "from 1st Day of Month "
                }${from ? from : ""} ${to ? "to " : ""}${to ? to : ""}`}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      {/* Chart of Earnings */}
      <Card className="flex-1 bg-transparent">
        <CardHeader>
          <CardTitle>Line Chart - Orders</CardTitle>
          <CardDescription>{`${from ? from : ""} - ${
            to ? to : ""
          }`}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigData} className="max-h-[300px]">
            <LineChart
              accessibilityLayer
              data={data ? data : []}
              margin={{
                left: 0,
                right: 12,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                }}
              />
              <YAxis
                dataKey="orders"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="orders"
                type="monotone"
                stroke="var(--color-orders)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                {`Orders is Trending ${
                  ordersPercent >= 0 ? "up by" : "down by"
                } ${ordersPercent.toFixed(1)}%`}
                {ordersPercent >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                {`Showing orders trending ${
                  from ? "from " : "from 1st Day of Month "
                }${from ? from : ""} ${to ? "to " : ""}${to ? to : ""}`}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LineChartView;
