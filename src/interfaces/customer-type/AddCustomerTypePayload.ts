export const CUSTOMER_TYPE_OPTIONS = [
  { label: "DINE_IN", value: "DINE_IN" },
  { label: "TAKE_AWAY", value: "TAKE_AWAY" },
  { label: "HOME_DELIVERY", value: "HOME_DELIVERY" },
  { label: "ONLINE", value: "ONLINE" },
] as const;

export type CustomerTypeValue = (typeof CUSTOMER_TYPE_OPTIONS)[number]["value"];


export interface AddCustomerTypePayload {
  type: CustomerTypeValue;

}