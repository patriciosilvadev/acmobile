import { Component } from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import { Global } from "src/app/Global";
import { DreService } from "src/app/services/dre.service";
import { UtilService } from "src/app/services/utilService";
import { TipoMercadoria } from "src/app/enums/tipo-mercadoria.enum";

@Component({
  selector: "app-vendas-dre",
  templateUrl: "./vendas-dre.component.html",
  styleUrls: ["./vendas-dre.component.scss"],
})
export class VendasDreComponent {
  public filtro;
  public mesEscolhido;
  public listaComb: any[];
  public listaProd: any[];
  public totalGeral: number;
  public totalComb: number;
  public totalProd: number;
  public totalLitros: number;
  public totalQtd: number;
  public dataInicio: any;
  public dataFinal: any;

  constructor(
    private modalController: ModalController,
    private _service: DreService,
    private global: Global,
    private _util: UtilService
  ) {}

  ngOnInit() {
    let filtro = this._util.filtrarDatasDre(this.filtro);
    this.dataInicio = this._util.converteDataNormal(filtro.inicio);
    this.dataFinal = this._util.converteDataNormal(filtro.final);
    this.getVendasDre(filtro.inicio, filtro.final);
  }

  getVendasDre(inicio, final) {
    this._service
      .getVendas(this.global.cnpj, inicio, final)
      .then((dados) => {
        this.organizaLista(dados);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  organizaLista(lista) {
    var comb = [],
      prod = [];
    lista.forEach((e) => {
      if (e.tipo === TipoMercadoria.COMBUSTIVEL) {
        e.quantidade = Math.round(e.quantidade);
        e.descricao = UtilService.getNomeComb(e.descricao);
        comb.push(e);
      } else {
        prod.push(e);
      }
    });
    this.totalGeral = lista
      .map((rec) => rec.valor)
      .reduce((acc, currValue) => acc + currValue, 0);
    this.obterTotais(comb, prod);
  }

  obterTotais(lComb, lProd) {
    if (lComb) {
      this.listaComb = lComb;
      this.totalComb = this.listaComb
        .map((rec) => rec.valor)
        .reduce((acc, currValue) => acc + currValue, 0);
      this.totalLitros = this.listaComb
        .map((rec) => rec.quantidade)
        .reduce((acc, currValue) => acc + currValue, 0);
    }
    if (lProd) {
      this.listaProd = lProd;
      this.totalProd = this.listaProd
        .map((rec) => rec.valor)
        .reduce((acc, currValue) => acc + currValue, 0);
      this.totalQtd = this.listaProd
        .map((rec) => rec.quantidade)
        .reduce((acc, currValue) => acc + currValue, 0);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
