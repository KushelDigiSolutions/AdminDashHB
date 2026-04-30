export type CashFreeRefundResponse = {
  success: true,
  message: "Success",
  data: {
    cf_payment_id: "3308897491",
    cf_refund_id: "64056114",
    created_at: "2024-12-13T13:14:18+05:30",
    entity: "refund",
    metadata: null,
    order_id: "order_7856352q9MhEmLydRgfvX4PXuaQoPuP4t",
    processed_at: null,
    refund_amount: 1,
    refund_arn: null,
    refund_charge: 0,
    refund_currency: "INR",
    refund_id: "d3c359a867",
    refund_mode: "NORMAL",
    refund_note: null,
    refund_speed: {
      requested: "STANDARD",
      accepted: "STANDARD",
      processed: null,
      message: null
    },
    refund_splits: [],
    refund_status: "PENDING",
    refund_type: "MERCHANT_INITIATED",
    status_description: "In Progress"
  }
}