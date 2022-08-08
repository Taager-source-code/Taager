import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  API_URLS,
  TAAGER_RECOMMENDATIONS_GROUP_ID,
} from "../../shared/constants";
@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProductsForCategory(pageSize, pageNum, query, category): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/searchQuery`;
    const body = { pageSize, page: pageNum, query, category };
    return this.http.post(url, body);
  }
  getById(id: string): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/viewProduct/${id}`;
    return this.http.get(url);
  }
  addProdImage(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/addProdImage`;
    return this.http.post(url, formData);
  }
  addProduct(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/addProduct`;
    return this.http.post(url, formData);
  }
  getProducts(pageSize, pageNum, filterObj): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/viewProducts`;
    const bodyParam = { pageSize, page: pageNum, filter: filterObj };
    return this.http.post(url, bodyParam);
  }
  getProductById(id): Observable<any> {
    const body = { paseSize: 1, page: 1, filter: { prodID: id } };
    return this.http.post(API_URLS.VIEW_PRODUDCTS_URL, body);
  }
  editProduct(id, body): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/editProduct/${id}`;
    return this.http.patch(url, body);
  }
  getCategories(country?: string): Observable<any> {
    const url = `${environment.BACKEND_URL}api/category/getCategories/${
      country ? "?country=" + country : ""
    }`;
    return this.http.get(url);
  }
  getProductsByIds(ids): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/getProductsByIds`;
    return this.http.post(url, ids);
  }
  getProductsByProdIds(prodIDs): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/getProductsByProdIds`;
    return this.http.post(url, prodIDs);
  }
  getBestsellers(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/getBestsellersList`;
    return this.http.get(url);
  }
  setProductsOrderCount(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/product/setProductsOrderCount`;
    return this.http.get(url);
  }
  addCategory(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/category/addCategory`;
    return this.http.post(url, formData);
  }
  deleteCategory(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/category/delete/${id}`;
    return this.http.delete(url);
  }
  updateCategory(id, body): Observable<any> {
    const url = `${environment.BACKEND_URL}api/category/updateCategory/${id}`;
    return this.http.patch(url, body);
  }
  fixProductsWithMissingCategory(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/category/fixProductsWithMissingCategory/`;
    return this.http.get(url);
  }
  getTaagerRecommendedGroup(): Observable<any> {
    return this.http.get(
      API_URLS.FEATURED_PRODUCTS_GROUP_URL(TAAGER_RECOMMENDATIONS_GROUP_ID)
    );
  }
  setTaagerRecommendedGroupProducts(
    TaagerRecommendedProducts
  ): Observable<any> {
    const body = { products: TaagerRecommendedProducts };
    return this.http.patch(
      API_URLS.FEATURED_PRODUCTS_GROUP_URL(TAAGER_RECOMMENDATIONS_GROUP_ID),
      body
    );
  }
}
