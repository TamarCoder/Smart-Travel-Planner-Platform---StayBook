"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatMoney } from "@/lib/utils/currency";

const COLORS: Record<string, string> = {
  flights: "#00668a",
  hotels: "#131b2e",
  dining: "#f59e0b",
  activities: "#009668",
  transport: "#40c2fd",
  other: "#76777d",
};

interface CategoryDonutProps {
  data: { category: string; amount: number }[];
  currency: string;
}

export function CategoryDonut({ data, currency }: CategoryDonutProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
      <div className="relative h-56 w-full md:w-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive
            >
              {data.map((d) => (
                <Cell key={d.category} fill={COLORS[d.category] ?? "#64748b"} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                fontSize: 12,
              }}
              formatter={(value, name) => [formatMoney(Number(value), currency), String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Total</p>
          <p className="text-lg font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            {formatMoney(total, currency)}
          </p>
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-2 gap-2 text-xs">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.amount / total) * 100) : 0;
          return (
            <li key={d.category} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[d.category] ?? "#64748b" }}
              />
              <span className="flex-1 truncate capitalize text-text-secondary">{d.category}</span>
              <span className="font-medium text-text-primary">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}