import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {GetCategoriesResponse} from "../../models/interfaces/categories/responses/GetCategoriesResponse";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get("USER_INFO");
  private httpOptions = {
    headers: new HttpHeaders({
       'Content-Type': 'application/json',
        Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    )
  }
}
