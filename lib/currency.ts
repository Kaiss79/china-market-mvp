export type Currency = "UAH" | "USD" | "EUR" | "RUB" | "RON" | "CNY";

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "UAH", symbol: "₴", label: "Ukrainian Hryvnia" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "RUB", symbol: "₽", label: "Russian Ruble" },
  { code: "RON", symbol: "lei", label: "Romanian Leu" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan" },
];

export const DEFAULT_CURRENCY: Currency = "UAH";

// MVP fixed rates from UAH
const RATES: Record<Currency, number> = {
  UAH: 1,
  USD: 0.024,
  EUR: 0.022,
  RUB: 2.2,
  RON: 0.11,
  CNY: 0.17,
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;
}

// amount is in kopecks (UAH cents). Converts and formats.
export function formatCurrency(amountKopecks: number, currency: Currency): string {
  const n = Number(amountKopecks);
  if (isNaN(n)) return "—";
  const uah = n / 100;
  const rate = RATES[currency] ?? 1;
  const converted = uah * rate;
  const sym = getCurrencySymbol(currency);

  switch (currency) {
    case "UAH":
      return `${converted.toFixed(2)} ${sym}`;
    case "RUB":
      return `${Math.round(converted)} ${sym}`;
    case "RON":
      return `${converted.toFixed(2)} ${sym}`;
    case "USD":
    case "EUR":
      return `${sym}${converted.toFixed(2)}`;
    case "CNY":
      return `${sym}${converted.toFixed(2)}`;
    default:
      return `${converted.toFixed(2)} ${sym}`;
  }
}
