export interface CountryModel {
  englishName: string;
  arabicName: string;
  currency: CurrencyModel;
  isoCode2: string;
  isoCode3: string;
}
export interface CurrencyModel {
  englishName: string;
  arabicName: string;
}
