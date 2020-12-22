import { Component, ViewChild } from "@angular/core";
import { Global } from "../../../Global";
import { UtilService } from "../../../services/utilService";
import { CaixaService } from "../../../services/caixa-service";
import { IonContent } from "@ionic/angular";

@Component({
  selector: "page-caixa-component",
  templateUrl: "caixa.component.html",
  styleUrls: ["caixa.component.css"],
})
export class CaixaComponent {
  constructor(
    private _service: CaixaService,
    private _util: UtilService,
    public global: Global
  ) {}

  @ViewChild(IonContent, { static: false }) content: IonContent;

  public shownGroup = null;
  datePickerObj: any = this._util.iniciaDatePicker();
  public listaCaixas: any[];
  public lancamentos: any[];
  public caixa: any;
  public data;
  public turno: string;
  public listTurnos: string[];
  public creditos: any[];
  public debitos: any[];

  ionViewDidEnter() {
    this.listaCaixas = undefined;
    this.listTurnos = [];
    this.creditos = undefined;
    this.debitos = undefined;
    this.caixa = undefined;
    this._service
      .getUltimaVenda(this.global.cnpj)
      .then((dados) => {
        this.listaCaixas = dados;
        this.atualizaDados();
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }

  atualizaDados() {
    if (this.listaCaixas.length > 0) {
      this.data = this._util.converteDataNormal(
        this.listaCaixas[this.listaCaixas.length - 1].data
      );
      this.turno = this.listaCaixas[this.listaCaixas.length - 1].turno;
      this.atualiza();
    } else {
      this.listTurnos = [];
    }
  }

  atualiza() {
    this.listTurnos = this.listaCaixas.map((vendas) => vendas.turno);
    if (this.turno === "Todos") {
      let caixaTodos = { lancamentosCaixa: [], data: undefined };
      let novoCaixa: any = { lancamentosCaixa: [] };
      this.listaCaixas
        .filter(
          (vendas) => vendas.data === this._util.converteDataIso(this.data)
        )
        .forEach((cai) => {
          novoCaixa.data = cai.data;
          novoCaixa.lancamentosCaixa.push(...cai.lancamentosCaixa);
          novoCaixa.itensLancamentoCaixa.push(...cai.itensLancamentoCaixa);
        });

      caixaTodos.data = novoCaixa.data;

      novoCaixa.lancamentosCaixa.reduce(function (res, value) {
        if (!res[value.descricao]) {
          res[value.descricao] = {
            descricao: value.descricao,
            valor: 0,
            tipo: value.tipo,
          };
          caixaTodos.lancamentosCaixa.push(res[value.descricao]);
        }
        res[value.descricao].valor += value.valor;
        return res;
      }, {});

      this.caixa = caixaTodos;
    } else {
      this.caixa = this.listaCaixas.filter(
        (caixas) =>
          caixas.data === this._util.converteDataIso(this.data) &&
          caixas.turno === this.turno
      )[0];
    }
    this.creditos = this.caixa.lancamentosCaixa.filter((l) => l.tipo === "C");
    this.debitos = this.caixa.lancamentosCaixa.filter((l) => l.tipo === "D");
    this.caixa.totalVendas = this.debitos
      .map((rec) => rec.valor)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.caixa.totalEntradas = this.creditos
      .map((rec) => rec.valor)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (this.caixa.itensLancamentoCaixa) {
      this.groupBy();
    }
  }

  groupBy() {
    let resultado = [];
    let obj = this._util.agruparLista(this.caixa.itensLancamentoCaixa, 'tipo');
    
    for (const [key, value] of Object.entries(obj)) {
      let result: any = {};
      result.nome = key;
      result.lancamentos = value;      
      result.total = result.lancamentos
        .map((rec) => rec.valor)
        .reduce((acc, currValue) => acc + currValue, 0);
      resultado.push(result);
    }
    this.lancamentos = resultado;
  }

  atualizaData() {
    let dataAtual =
      this.listaCaixas && this.listaCaixas.length > 0
        ? this.listaCaixas[0].data
        : undefined;
    let dataConsulta = this._util.converteDataIso(this.data);
    if (dataAtual !== dataConsulta) {
      this._service
        .getVendasPorData(this.global.cnpj, dataConsulta)
        .then((dados) => {
          this.listaCaixas = dados;
          this.atualizaDados();
        })
        .catch((err) => {
          this._util.showMessage("Erro!", err);
        });
    }
  }

  toggleGroup(group) {
    if (this.isGroupShown(group.toUpperCase())) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group.toUpperCase();
      let element = document.getElementById("X" + group.toUpperCase());
      let posicao = element.scrollHeight;
        this.content.scrollToPoint(0, posicao + 500, 1000);
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group.toUpperCase();
  }

  resultado() {
    return this.caixa.totalEntradas - this.caixa.totalVendas > 0
      ? "verde"
      : "vermelho";
  }

  customActionSheetOptions: any = {
    header: "Selecione o Posto:",
  };
}
