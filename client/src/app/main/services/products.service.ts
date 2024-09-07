import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsPath: string = environment.apiUrl + 'products';

  constructor(
    private http: HttpClient
  ){}

  getProduct(id: number):Observable<any>{
    return this.http.get<any>(this.productsPath + "/" + id);
  }

  getProducts(skip: string, take: string): Observable<any> {
    const params = new HttpParams()
      .set('skip', skip)
      .set('take', take);

    return this.http.get(this.productsPath, { params });
  }
}
