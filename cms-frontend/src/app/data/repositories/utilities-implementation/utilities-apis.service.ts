import { Injectable } from '@angular/core';
import { API_URLS } from '@data/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UtilitiesApisService {
  constructor(
    private http: HttpClient,
  ) { }
  uploadImage(file: FormData): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(API_URLS.UPLOAD_IMAGE_URL, file);
  }
}
