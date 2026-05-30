"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactMoney, formatMoney } from "@/lib/utils/currency";

interface Datum {
  date: string;
  cumulative: number;
  daily: number;
}

interface DailySpendChartProps {
  data: Datum[];
  currency: string;
}

export function DailySpendChart({ data, currency }: DailySpendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/40 text-sm text-text-secondary">
        Log expenses to see spending trends.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => shortDate(String(value))}
          />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value) => formatCompactMoney(Number(value), currency)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: 12,
            }}
            formatter={(value, name) => [formatMoney(Number(value), currency), String(name)]}
            labelFormatter={(label) => longDate(String(label))}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="url(#spendGradient)"
            name="Cumulative"
          />
          <Area
            type="monotone"
            dataKey="daily"
            stroke="#f97316"
            strokeWidth={1.5}
            fill="transparent"
            name="Daily"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function shortDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function longDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}