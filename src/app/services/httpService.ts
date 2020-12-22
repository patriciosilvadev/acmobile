import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private _http: HttpClient) {}

  private urlServer: string = "http://app.autocomsistemas.com.br/sga/";
  // private urlServer: string = 'http://localhost:8080/sga/';
  // private urlServer: string = 'http://192.168.50.76:8080/sga/'; //roteador 1
  // private urlServer: string = 'http://192.168.2.102:8080/sga/'; //roteador 2

  // Faz uma Requisição Get e retorna o Resultado.
  getHttp(url) {
    new HttpHeaders();
    return this._http
      .get<any>(this.urlServer + url, {
        headers: new HttpHeaders({ Authorization: "@utocom#123" }),
      })
      .toPromise();
  }

  // Faz uma Requisição Post e retorna o Resultado.
  postHttp(url, objeto) {
    return this._http
      .post<any>(this.urlServer + url, objeto, {
        headers: new HttpHeaders({ Authorization: "@utocom#123" }),
      })
      .toPromise();
  }
}
