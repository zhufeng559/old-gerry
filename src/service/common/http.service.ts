import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient) {
    console.log('Hello HttpService');
  }

  get(url: string, para: HttpParams= null) {
    const request = `${environment.SERVER_URL}${url}`;
    const option = {
      params: para
    };
    return this.http.get(request, option);
  }

  post(url: string, body: any) {
    const request = `${environment.SERVER_URL}${url}`;
    return this.http.post(request, body);
  }
}
