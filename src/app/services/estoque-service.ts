import {Injectable} from '@angular/core';
import {HttpService} from "./httpService";

@Injectable()
export class EstoqueService {

  constructor(private _http: HttpService) { }

  getEstoque(cnpj: String)  {
    return this._http.postHttp('estoqueAtual/listar', cnpj);
  }
}
