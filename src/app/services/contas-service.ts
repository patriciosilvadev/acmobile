import {Injectable} from '@angular/core';
import {HttpService} from "./httpService";

@Injectable()
export class ContasService {

  constructor(private _http: HttpService) { }

  getContas(cnpj: String)  {
    return this._http.postHttp('contas/listar', cnpj);
  }
}
