import { Injectable } from "@angular/core";
import { Global } from "../Global";
import { HttpService } from "./httpService";
import { UtilService } from "./utilService";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class DreService {
  constructor(
    private _http: HttpService,
    private global: Global,
    private _util: UtilService
  ) {}

  getTotais(cnpj, dataInicio, dataFim){
    let filtro = { cnpj, dataInicio, dataFim };
    return this._http.postHttp("dre/listarTotais", filtro);
  }

  getVendas(cnpj, dataInicio, dataFim) {
    let filtro = { cnpj, dataInicio, dataFim };
    return this._http.postHttp("dre/listarVendas", filtro);
  }

  getDespesas(cnpj, dataInicio, dataFim) {
    let filtro = { cnpj, dataInicio, dataFim };
    return this._http.postHttp("dre/listarDespesas", filtro);
  }

  getCreditos(cnpj, dataInicio, dataFim) {
    let filtro = { cnpj, dataInicio, dataFim };
    return this._http.postHttp("dre/listarCreditos", filtro);
  }

  salvar(lista) {
    return this._http.postHttp("dre/outros/salvar", lista);
  }

  popularBanco() {
    var lista = [];
    var desc = ["Despesa 1", "Despesa 2", "Despesa 3", "Despesa 4"];
    var cred = ["Credito 1", "Credito 2", "Credito 3", "Credito 4"];
    var id: number = 1;
    for (let i = 0; i < 300; i++) {
      let random = Math.random() < 0.6;
      if (random) {
        id = id + i;
        let dataSemFormat = moment()
          .subtract(i, "days")
          .year(2020)
          .format("DD/MM/YYYY");
        let data = this._util.converteDataIso(dataSemFormat);
        let descricao = desc[UtilService.random(0, 3)];
        let cnpj = this.global.cnpj;
        let valor = UtilService.random(50, 1200);
        let tipo = "DEBITO";
        lista.push({ id, data, descricao, cnpj, valor, tipo });
      } else {
        id = id + i;
        let dataSemFormat = moment()
          .subtract(i, "days")
          .year(2020)
          .format("DD/MM/YYYY");
        let data = this._util.converteDataIso(dataSemFormat);
        let descricao = cred[UtilService.random(0, 3)];
        let cnpj = this.global.cnpj;
        let valor = UtilService.random(50, 200);
        let tipo = "CREDITO";
        lista.push({ id, data, descricao, cnpj, valor, tipo });
      }
    }
    this.salvar(lista)
      .then((dados) => {
        console.log(dados);
      })
      .catch((err) => {
        console.error("ERRO", err);
      });
  }
}
