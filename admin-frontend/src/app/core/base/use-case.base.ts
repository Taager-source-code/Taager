import { Observable } from "rxjs";
export interface IUseCase<S, T> {
  execute(params: S): Observable<T>;
}
