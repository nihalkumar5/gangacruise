export type PaymentOrder = {
  id: string
  amount: number
  currency: "INR"
  receipt: string
  status: "created" | "verified"
}

export async function createRazorpayOrderMock(amount: number, receipt: string) {
  return {
    id: `order_mock_${receipt.toLowerCase()}`,
    amount,
    currency: "INR",
    receipt,
    status: "created",
  } satisfies PaymentOrder
}

export function verifyPaymentSignatureMock() {
  return true
}
