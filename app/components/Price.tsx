"use client";

import { useSettings } from "./SettingsProvider";

export default function Price({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const { formatPrice } = useSettings();
  // suppressHydrationWarning: server renders with cookie-based currency,
  // client may differ briefly until hydration — this is intentional.
  return (
    <span className={className} suppressHydrationWarning>
      {formatPrice(amount)}
    </span>
  );
}
