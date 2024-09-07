import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersPath: string = environment.apiUrl + 'orders';

  constructor(
    private http: HttpClient
  ){}

  createOrder(data:any): Observable<any>{
    return this.http.post(this.ordersPath, data);
  }
}
