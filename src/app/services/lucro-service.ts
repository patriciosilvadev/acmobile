import { Injectable } from "@angular/core";
import { Global } from "../Global";
import { HttpService } from "./httpService";
import { VendasService } from "./vendas-service";

@Injectable()
export class LucroService {
  private venda: any;
  private dre: any = {};

  constructor(
    private _http: HttpService,
    private vendas: VendasService,
    private global: Global
  ) {}

  set() {
    this.dre = {
      vendas: {
        valorTotal: 573552.89,
        totalComb: 572008.19,
        totalProd: 1544.7,
        vendasComb: [],
        vendasProd: [],
      },
      custos: {
        valorTotal: 524682.69,
        totalComb: 523894.69,
        totalProd: 788,
        custosComb: [],
        custosProd: [],
      },
      lucroBruto: {
        totalLucro: this.calculaLucro(573552.89, 524682.69),
        lucroComb: this.calculaLucro(572008.19, 523894.69),
        lucroProd: this.calculaLucro(1544.7, 788),
      },
      margemBruta: 13.66,
      outrasReceitas: {
        valorTotal: 3126.25,
        listaReceitas: [],
      },
      despesas: {
        valorTotal: 25767.9,
        listaDespesas: [],
      },
      resultadoLiquido: 14768.95,
    };
  }

  private calculaLucro(a, b) {
    return a - b;
  }

  getLucro(cnpj: String) {
    return this._http.postHttp("lucro/listar", cnpj);
  }

  getRelatorio(date) {
    this.set();
    return this.dre;
  }
}
