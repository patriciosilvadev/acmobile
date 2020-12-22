import {HttpService} from "./httpService";
import {Injectable} from '@angular/core';

@Injectable()
export class CaixaService {

  constructor(private _http: HttpService) { }

  getVendasPorData(cnpj: String, data: String) {
    return this._http.postHttp('caixa/listarVendaPorData', { 'cnpj' : cnpj, 'dataInicio':  data, 'dataFim':  undefined});
  }
  getUltimaVenda(cnpj: String) {
    return this._http.postHttp('caixa/listarUltimasVendas', cnpj);
  }
}
