
export interface AddPaymentPayload {
  orderId: string;
  methods: Method[];
 
}

interface Method {
  accountId: string;
  amount: number;
}