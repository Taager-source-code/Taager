import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class SurveyService {
  constructor(private http: HttpClient) {}
  getSurveys(pageSize, pageNum, filterSurveyObj): Observable<any> {
    const url = `${environment.BACKEND_URL}api/survey?pageSize=${pageSize}&pageNum=${pageNum}&surveyId=${filterSurveyObj.surveyId}&isEnabled=${filterSurveyObj.isEnabled}&_id=${filterSurveyObj._id}&name=${filterSurveyObj.name}`;
    return this.http.get(url);
  }
  createSurvey(
    surveyQuestion,
    surveyName,
    isEnabled,
    activeInDays
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/survey`;
    const body = {
      question: surveyQuestion,
      surveyName,
      isEnabled,
      activeInDays,
    };
    return this.http.post(url, body);
  }
  editSurvey(surveyId, surveyName, isEnabled): Observable<any> {
    const url = `${environment.BACKEND_URL}api/survey/${surveyId}`;
    const body = { surveyName, isEnabled };
    return this.http.patch(url, body);
  }
}
