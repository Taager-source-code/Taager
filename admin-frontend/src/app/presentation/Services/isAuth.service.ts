import { Injectable } from "@angular/core";
@Injectable()
export class ISAuthenticatedService {
  constructor() {}
  checkAuth(): boolean {
    return !!localStorage.getItem("user");
  }
  setStorage(key, value): void {
    localStorage.setItem(key, value);
  }
  logout(): void {
    localStorage.clear();
  }
  getToken(): string {
    return localStorage.getItem("user");
  }
  getStorage(key): string {
    return localStorage.getItem(key);
  }
  deleteStorage(key): void {
    localStorage.removeItem(key);
  }
}
