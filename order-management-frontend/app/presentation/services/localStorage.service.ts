import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  tokenKey = 'user';
  // initiating the default values
  constructor() {}
  /*
   * add/set item to browser localstorage
   * @param {key} the identifier for the local storage item
   * @param {value} the value of localstorage item
   **/
  public setStorage(key: string, value: any) {
    const newKey = 'OA' + '.' + key;
    localStorage.setItem(newKey, JSON.stringify(value));
  }
  /*
   * read certain item from the session storage or from the cachedSession and
   * parse the item to json if the item is a stringified object.
   * @param  {key} The key of the property to be detected
   * @returns {Object} the returned object holds the value for the detected property
   **/
  public getStorage(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      return localStorage.getItem(key);
    }
  }
  getToken(){
      const token = JSON.parse(localStorage.getItem('user'));
      return token;
  }
}
