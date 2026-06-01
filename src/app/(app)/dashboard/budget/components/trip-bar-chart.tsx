"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { formatCompactMoney, formatMoney } from "@/lib/utils/currency";

interface Datum {
  trip: string;
  spent: number;
  budget: number;
}

interface TripBarChartProps {
  data: Datum[];
  currency: string;
}

export function TripBarChart({ data, currency }: TripBarChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} barCategoryGap={24}>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" />
          <XAxis dataKey="trip" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            tickFormatter={(value) => formatCompactMoney(Number(value), currency)}
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-muted)", opacity: 0.5 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: 12,
            }}
            formatter={(value, name) => [formatMoney(Number(value), currency), String(name)]}
          />
          <Bar dataKey="budget" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
            {data.map((d) => {
              const pct = d.budget > 0 ? d.spent / d.budget : 0;
              const color = pct >= 1 ? "#ba1a1a" : pct >= 0.8 ? "#f59e0b" : "#00668a";
              return <Cell key={d.trip} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}