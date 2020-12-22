import {Injectable} from '@angular/core';
import {HttpService} from "./httpService";

@Injectable()
export class VendasService {

  constructor( private _http: HttpService) {}

  getVendasPorData(cnpj: String, dataInicio: String, dataFim: String) {
   return this._http.postHttp('vendas/listarVendaPorData', { 'cnpj' : cnpj, 'dataInicio':  dataInicio, 'dataFim':  dataFim});
  }
  getUltimaVenda(cnpj: String) {
   return this._http.postHttp('vendas/listarUltimasVendas', cnpj);
  }
}