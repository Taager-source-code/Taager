export interface ShippingCompany {
  companyName: string;
  value: string;
}
export interface ShippingStatus {
  status: string;
  value: string;
}
export enum RequestStatus {
  NotTriggered = "Not triggered",
  Success = "Success",
  Processing = "Processing",
  Failed = "Failed",
}
