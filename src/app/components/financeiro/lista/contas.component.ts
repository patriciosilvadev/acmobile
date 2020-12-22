import { Component } from "@angular/core";
import { Global } from "../../../Global";
import { UtilService } from "../../../services/utilService";
import { ContasService } from "../../../services/contas-service";
import { EstoqueService } from "../../../services/estoque-service";
import { Contas } from "../contas";
import { TipoConta } from "../tipo-conta";

@Component({
  selector: "page-contas-component",
  templateUrl: "contas.component.html",
  styleUrls: ["contas.component.css"],
})
export class ContasComponent {
  constructor(
    private _service: ContasService,
    private _serviceEstoque: EstoqueService,
    private _util: UtilService,
    public global: Global
  ) {}

  public listaContas: Contas[];
  public listaContasPagar: Contas[];
  public listaContasReceber: Contas[];
  public totalReceber: number = 0;
  public totalPagar: number = 0;
  public data: Date;

  ionViewDidEnter() {
    this.listaContas = [];
    this.listaContasPagar = [];
    this.listaContasReceber = [];
    this.totalReceber = undefined;
    this.totalPagar = undefined;
    this._service
      .getContas(this.global.cnpj)
      .then((dados) => {
        this.listaContas = dados.sort(
          (a, b) => +(a.descricao > b.descricao) - +(a.descricao < b.descricao)
        );
        if (this.listaContas.length > 0) {
          this.listaContasPagar = this.listaContas.filter(
            (contas) =>
              TipoConta.parse(contas.tipo.toString()) === TipoConta.PAGAR
          );
          this.listaContasReceber = this.listaContas.filter(
            (contas) =>
              TipoConta.parse(contas.tipo.toString()) === TipoConta.RECEBER
          );
          if (this.listaContasPagar) {
            this.totalPagar = this.listaContasPagar
              .map((rec) => rec.valor)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
          }
          if (this.listaContasReceber) {
            this.totalReceber = this.listaContasReceber
              .map((rec) => rec.valor)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
          }
        }
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });

    this._serviceEstoque
      .getEstoque(this.global.cnpj)
      .then((dados) => {
        if (dados.length > 0) {
          this.data = dados[0].dataHora;
        } else {
          this.data = new Date();
        }
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }

  customActionSheetOptions: any = {
    header: "Selecione o Posto:",
  };
}
