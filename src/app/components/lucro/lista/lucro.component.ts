import { Component, ViewChild } from "@angular/core";
import { UtilService } from "../../../services/utilService";
import { Global } from "../../../Global";
import { Lucro } from "../lucro";
import { LucroService } from "../../../services/lucro-service";
import { LucroAtual } from "../lucroAtual";
import { IonContent } from "@ionic/angular";

@Component({
  selector: "page-lucro-component",
  templateUrl: "lucro.component.html",
  styleUrls: ["lucro.component.css"],
})
export class LucroComponent {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  public shownGroup = null;
  public lucro: Lucro[];
  public totalReais: number;
  public totalLitros: number;
  public totalVenda: number;
  public totalPorcentagem: number;
  public dataHora: Date;
  public dataChart = [];

  view: any[] = [340, 400];
  customColors = UtilService.getChartColors();

  constructor(
    public global: Global,
    private _service: LucroService,
    private _util: UtilService
  ) {}

  ngAfterViewInit() {
    this.lucro = [];
    this.dataChart = [];
    this.dataHora = undefined;
    this.totalPorcentagem = undefined;
    this.totalReais = undefined;
    this.totalLitros = undefined;
    this.totalVenda = undefined;

    this._service
      .getLucro(this.global.cnpj)
      .then((dados) => {        
        if (dados.length > 0) {
          this.atualiza(dados[0]);
        } else {
          this.lucro = null;
        }
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }

  customActionSheetOptions: any = {
    header: "Selecione o Posto:",
  };

  atualiza(lucroAtual: LucroAtual) {
    this.lucro = lucroAtual.lucro.sort((a, b) => a.reais - b.reais);
    this.dataHora = lucroAtual.dataHora;
    this.totalPorcentagem =
      this.lucro
        .map((rec) => rec.porcentagem)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
      this.lucro.length;
    this.totalReais = this.lucro
      .map((rec) => rec.reais)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.totalLitros = this.lucro
      .map((rec) => rec.litros)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.totalVenda = this.lucro
      .map((rec) => rec.litros * rec.pVenda)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    let dataChartTemp = [];
    this.lucro.forEach(function (v) {
      dataChartTemp.push({
        name: v.combustivel,
        value: v.reais,
        extra: {
          margem: v.porcentagem,
        },
      });
    });

    this.dataChart = dataChartTemp;
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
      let element = document.getElementById("x" + group);
      let posicao = element.scrollHeight;
      this.content.scrollToPoint(0, posicao + 500, 1000);
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  getComb(sigla) {
    return UtilService.getNomeComb(sigla);
  }

  formataLabel(valor) {
    return `<small class="number-card-label">Margem Lucro: ${
      valor.data.extra.margem
    } %<br/><b>${UtilService.getNomeComb(valor.label)}</b></small>`;
  }

  formataValor(valor) {
    if (valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor.value.toFixed(4));
    } else {
      return valor;
    }
  }
}
