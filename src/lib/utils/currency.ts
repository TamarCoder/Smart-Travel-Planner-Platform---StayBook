export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF";

const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 152,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.87,
};

export const CURRENCIES = Object.keys(RATES) as CurrencyCode[];

export function isSupportedCurrency(code: string): code is CurrencyCode {
  return code in RATES;
}

export function convert(amount: number, from: string, to: string): number {
  const f = isSupportedCurrency(from) ? from : "USD";
  const t = isSupportedCurrency(to) ? to : "USD";
  if (f === t) return amount;
  return (amount / RATES[f]) * RATES[t];
}

export function formatMoney(
  amount: number,
  currency = "USD",
  locale = "en-US",
  options: Intl.NumberFormatOptions = {},
): string {
  const safeCurrency = currency || "USD";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: amount >= 1000 ? 0 : 2,
      ...options,
    }).format(amount);
  } catch {
    return `${safeCurrency} ${amount}`;
  }
}

export function formatCompactMoney(amount: number, currency = "USD"): string {
  const safeCurrency = currency || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${safeCurrency} ${amount}`;
  }
}
