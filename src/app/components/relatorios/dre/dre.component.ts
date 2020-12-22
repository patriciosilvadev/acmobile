import { Component, ViewChild } from "@angular/core";
import {
  ModalController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { Global } from "src/app/Global";
import { UtilService } from "src/app/services/utilService";
import { FiltroDataComponent } from "./filtro-data/filtro-data.component";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";
import { DreService } from "src/app/services/dre.service";
import { VendasDreComponent } from "./modal/vendas-dre/vendas-dre.component";
import { CustosDreComponent } from "./modal/custos-dre/custos-dre.component";
import { OutrasReceitasModalComponent } from "./modal/outras-receitas/outras-receitas.component";
import { DespesasModalComponent } from "./modal/despesas/despesas.component";

@Component({
  selector: "app-dre",
  templateUrl: "./dre.component.html",
  styleUrls: ["./dre.component.scss"],
})
export class DreComponent {
  @ViewChild("barChart", { static: false }) barChart;

  public lucro: any = [];
  private modal: any = [
    VendasDreComponent,
    CustosDreComponent,
    OutrasReceitasModalComponent,
    DespesasModalComponent,
  ];
  public currentPopover: any;
  public mesEscolhido: any;
  public showDetalhes: any;
  private dataFiltro: any = 15;
  public total: any = {};
  public dataInicio;
  public dataFinal;
  public defaultSegment = 15;

  constructor(
    public global: Global,
    private _service: DreService,
    private _util: UtilService,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {}

  ionViewDidEnter() {
    let filtro = this._util.filtrarDatasDre(this.dataFiltro);
    this.dataInicio = this._util.converteDataNormal(filtro.inicio);
    this.dataFinal = this._util.converteDataNormal(filtro.final);
    this.getTotais(filtro.inicio, filtro.final);
    this.showDetalhes = false;
  }

  getTotais(inicio, final) {
    this._service
      .getTotais(this.global.cnpj, inicio, final)
      .then((dados) => {
        if (dados.lucroBruto == 0 && dados.lucroLiquido == 0) {
          this.mesEscolhido &&
            this._util.showMessage(
              "Sem resultados",
              "Não existem dados nesse período " + this.mesEscolhido
            );
          this.dataFiltro = 15;
          this.defaultSegment = 15;
          this.mesEscolhido = null;
          this.ionViewDidEnter();
        } else {
          this.total = this.manipulaDadosTotais(dados);
          this.constroiDadosGrafico(dados.totalSemanal);
        }
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }

  constroiDadosGrafico(lista) {
    if (lista.length === 2) {
      this.createBarChart(
        ["Semana 1", "Semana 2"],
        [lista[0], lista[1]],
        this.getCorGrafico(lista)
      );
    } else {
      this.createBarChart(
        ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        [lista[0], lista[1], lista[2], lista[3]],
        this.getCorGrafico(lista)
      );
    }
  }

  getCorGrafico(lista) {
    var colors = [];
    lista.forEach((element) => {
      if (element > 0) {
        colors.push("#008000");
      } else {
        colors.push("#800000");
      }
    });
    return colors;
  }

  manipulaDadosTotais(lista) {
    let total: any = {};
    total = lista;
    total.vendas = lista.tVendaComb + lista.tVendaProd;
    total.custos = lista.tCustoComb + lista.tCustoProd;
    total.lucroComb = lista.tVendaComb - lista.tCustoComb;
    total.lucroProd = lista.tVendaProd - lista.tCustoProd;
    total.margemLucro = (total.lucroBruto / total.vendas) * 100;
    return total;
  }

  async abrirModal(index, total, nomeCampo) {
    if (total > 0) {
      const modalDre = await this.modalController.create({
        component: this.modal[index],
        componentProps: {
          filtro: this.dataFiltro,
          mesEscolhido: this.mesEscolhido,
        },
      });
      await modalDre.present();
    } else {
      this._util.showMessage(
        "Sem detalhes!",
        "Não existem " + nomeCampo + " neste período."
      );
    }
  }

  filtroData(res) {
    if (res === "custom") {
      this.abrirFiltro();
    } else {
      this.dataFiltro = res;
      this.mesEscolhido = null;
      this.ionViewDidEnter();
    }
  }

  async abrirFiltro() {
    const popover = await this.popoverController.create({
      component: FiltroDataComponent,
      translucent: false,
    });
    this.currentPopover = popover;
    await popover.present();
    popover
      .onDidDismiss()
      .then((res) => {
        if (!res.role) {
          this.dataFiltro = res.data.date;
          this.mesEscolhido = res.data.label;
          this.ionViewDidEnter();
        } else {
          this.dataFiltro = 30;
          this.defaultSegment = 30;
          this.mesEscolhido = null;
          this.ionViewDidEnter();
        }
      })
      .catch((err) => {
        console.log("erro ao filtrar datas", err);
      });
  }

  getColorResultado(res) {
    return res > 0 ? "lucroVerde" : "lucroRed";
  }

  createBarChart(legendas, resultados, cor) {
    new Chart(this.barChart.nativeElement, {
      plugins: [ChartDataLabels],
      type: "bar",
      data: {
        labels: legendas,
        datasets: [
          {
            data: resultados,
            backgroundColor: cor,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            top: 30,
            left: 8,
            right: 8,
          },
        },
        plugins: {
          datalabels: {
            color: "#666666",
            formatter: function (valor) {
              if (valor) {
                return new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(valor.toFixed(4));
              } else {
                return valor;
              }
            },
            anchor: "end",
            align: "end",
          },
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  toggle(group) {
    if (this.isGroupShown(group)) {
      this.showDetalhes = null;
    } else {
      this.showDetalhes = group;
    }
  }

  isGroupShown(group) {
    return this.showDetalhes === group;
  }

  customActionSheetOptions: any = {
    header: "Selecione o Posto:",
  };
}
