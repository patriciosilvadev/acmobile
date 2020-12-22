import {Injectable} from '@angular/core';
import {HttpService} from "./httpService";

@Injectable()
export class BicosService {

  constructor( private _http: HttpService) {}

  getBicos(cnpj: String) {
   return this._http.postHttp('bico/listarTudo', cnpj);
  }

}
