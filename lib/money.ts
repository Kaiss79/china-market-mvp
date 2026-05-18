/** Converts kopecks to display string: 249900 → "2 499.00 грн" */
export function formatMoney(amountInKopecks: number): string {
  const n = Number(amountInKopecks);
  if (!n || isNaN(n)) return "0.00 грн";
  return (n / 100).toFixed(2) + " грн";
}

/** Calculates sell price from cost + margin percent */
export function calculatePrice(costPrice: number, marginPercent: number): number {
  return Math.round(costPrice * (1 + marginPercent / 100));
}

/** Convert grn string input to kopecks integer */
export function grnToKopecks(grn: unknown): number {
  const n = parseFloat(String(grn));
  return isNaN(n) ? 0 : Math.round(n * 100);
}
