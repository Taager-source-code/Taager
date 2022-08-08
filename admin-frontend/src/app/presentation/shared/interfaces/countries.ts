export interface DBCountry {
  countryIsoCode2: string;
  countryIsoCode3: string;
  countryIsoNumber: number;
  currencyIsoCode: string;
}
export interface Country {
  isoCode2: string;
  isoCode3: string;
  currency: Currency;
  englishName: string;
  arabicName: string;
}
export interface Currency {
  englishName: string;
  arabicName: string;
}
