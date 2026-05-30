"use client";

import { useAuthStore } from "@/stores";
import { convert, formatMoney, type CurrencyCode } from "@/lib/utils/currency";

export function usePreferredCurrency(): CurrencyCode {
  const preferred = useAuthStore((s) => s.user?.preferences?.currency);
  return (preferred as CurrencyCode) ?? "USD";
}

export function useMoneyFormatter() {
  const currency = usePreferredCurrency();
  return (amount: number, sourceCurrency = "USD") => {
    const converted = convert(amount, sourceCurrency, currency);
    return formatMoney(converted, currency);
  };
}
