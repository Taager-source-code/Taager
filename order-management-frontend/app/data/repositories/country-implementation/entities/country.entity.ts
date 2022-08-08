export interface CountryEntity {
  countryIsoCode2: string;
  countryIsoCode3: string;
  countryIsoNumber: number;
  currencyIsoCode: string;
}
export interface CountryListResponseEntity {
  data: CountryEntity[];
  msg: string;
}
