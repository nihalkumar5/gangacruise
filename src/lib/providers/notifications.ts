export type NotificationPayload = {
  to: string
  subject: string
  html: string
}

export async function sendBookingEmailMock(payload: NotificationPayload) {
  return {
    id: `email_mock_${payload.to.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`,
    status: "queued",
    payload,
  }
}
