import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, timer } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = "{{POST_BUILD_ENTERS_HASH_HERE}}";
  constructor(private http: HttpClient) {}
  /**
   * checks in every set frequency the version of frontend application
   *
   * @param url the url of the generated version.json file
   * @param frequency - in milliseconds, defaults to 5 minutes
   */
  public versionChange(url, frequency = 1000 * 60 * 5): Observable<any> {
    return timer(0, frequency).pipe(switchMap(() => this.checkVersion(url)));
  }
  /**
   * @param hash the latest hash from the API
   * @returns a flag whether the version changed or not
   */
  versionDidChange(hash): boolean {
    const hashDidChange = this.didHashChange(this.currentHash, hash);
    this.currentHash = hash;
    return hashDidChange;
  }
  checkVersion(url): Observable<boolean> {
    return this.getVersionHash(url).pipe(
      switchMap(({ hash }) => of(this.versionDidChange(hash))),
      filter((value) => value)
    );
  }
  /**
   * will do the call and check if the hash has changed or not
   *
   * @param url the url of the generated version.json file
   */
  private getVersionHash(url): Observable<any> {
    // timestamp these requests to invalidate caches
    return this.http.get(url + "?t=" + new Date().getTime());
  }
  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   *
   * @param currentHash the version hash
   * @param newHash the new app version hash
   * @returns a flag whether it changed or not
   */
  private didHashChange(currentHash, newHash) {
    if (!currentHash || currentHash === "{{POST_BUILD_ENTERS_HASH_HERE}}") {
      return false;
    }
    return currentHash !== newHash;
  }
}
