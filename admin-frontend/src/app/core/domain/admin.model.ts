import { IAdminTypes } from "./admin.types";
export interface IAdminModel {
  createdAt: string;
  privileges: Array<string>;
  role: IAdminTypes;
  updatedAt: string;
  userCountriesAccess: Array<string>;
  _id: string;
}
