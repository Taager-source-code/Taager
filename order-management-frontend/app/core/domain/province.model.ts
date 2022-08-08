export interface ProvinceModel {
  branch: string;
  country: string;
  greenZones: string[];
  isActive: boolean;
  location: string;
  id: string;
}
export interface ProvinceZoneModel {
  name: string;
  zoneId: string;
  manuallyModified: boolean;
}
