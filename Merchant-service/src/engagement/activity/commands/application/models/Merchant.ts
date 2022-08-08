export type Merchant = {
  taagerId: string;
  email?: string;
  phone?: string;
  fullName: string;
  loyaltyProgram: string;
  merchantExperience: MerchantExperience;
};

export type MerchantExperience = {
  currentJob?: string;
  havePrevExperience?: string;
  yearsOfExperience?: string;
  onlineMarketplace?: string;
  expectedOrdersPerMonth?: string;
};


