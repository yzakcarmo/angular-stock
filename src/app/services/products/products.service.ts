import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../environments/environment";
import {Observable, map} from "rxjs";
import {GetAllProductsResponse} from "../../models/interfaces/products/response/GetAllProductsResponse";
import {DeleteProductResponse} from "../../models/interfaces/products/response/DeleteProductResponse";
import {CreateProductRequest} from "../../models/interfaces/products/request/CreateProductRequest";
import {CreateProductResponse} from "../../models/interfaces/products/response/CreateProductResponse";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }

  constructor(private http: HttpClient,  private cookie: CookieService) { }

  getAllProducts(): Observable<Array<GetAllProductsResponse>>{
    return this.http.get<Array<GetAllProductsResponse>>(
      `${this.API_URL}/products`,
      this.httpOptions
    )
      .pipe(map((product) => product.filter((data) => data?.amount > 0)))
  }

  deleteProduct(product_id: string) :Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions, params:{
          product_id: product_id,
        }
      }
    )
  }

  createProduct(requestDatas: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`, requestDatas, this.httpOptions
    )
  }

}
