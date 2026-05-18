export type PaymentRequest = {
  orderId: string;
  amount: number;
  description: string;
};

/**
 * Заглушка оплаты.
 * Позже здесь будет LiqPay, WayForPay или другой провайдер.
 */
export async function createPaymentLink(request: PaymentRequest) {
  console.log("Создаём оплату:", request);

  return `/checkout/success?orderId=${request.orderId}`;
}
