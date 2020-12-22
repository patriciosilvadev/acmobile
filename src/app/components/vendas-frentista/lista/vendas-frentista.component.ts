import { Component } from "@angular/core";
import { UtilService } from "../../../services/utilService";
import { Global } from "../../../Global";
import { VendasFrentistas } from "../vendas-frentistas";
import { GoogleChartInterface } from "ng2-google-charts/google-charts-interfaces";
import { VendasService } from "../../../services/vendas-service";
import { TabService } from "../../../services/tab-service";

declare var google;

@Component({
  selector: "page-vendas-frentista-component",
  templateUrl: "vendas-frentista.component.html",
  styleUrls: ["vendas-frentista.component.css"],
})
export class VendasFrentistaComponent {
  public vendasFrent: VendasFrentistas[];
  public totalLts;
  public totalReais;
  public totalQtd;
  public pieChart: GoogleChartInterface;

  constructor(public global: Global, private tabService: TabService) {
    // Validando consultas
    this.tabService.frentAtivo().subscribe(() => {
      this.atualiza();
    });
  }

  ionViewDidEnter() {
    if (this.global.listVendas && this.global.listVendas.length > 0) {
      this.atualiza();
    } else {
      this.vendasFrent = null;
      this.global.listTurnos = null;
    }
  }

  private static inicializaChart() {
    const dataChart = new google.visualization.DataTable();
    dataChart.addColumn("string", "Frentista");
    dataChart.addColumn("number", "Valor");
    dataChart.addColumn({ type: "string", role: "tooltip", p: { html: true } });

    return dataChart;
  }

  drawChart(dataChart) {
    this.pieChart = {
      chartType: "PieChart",
      dataTable: dataChart,
      //opt_firstRowIsData: true,
      options: {
        width: 320,
        height: 320,
        chartArea: { width: "100%", height: "90%" },
        legend: "none",
        tooltip: { isHtml: "true" },
        is3D: true,
      },
    };
  }

  atualiza() {
    this.vendasFrent = [];
    let vendasF1 = [];
    let vendasF = [];
    let vendasFrent = this.global.listVendas.filter(
      (vendas) => vendas.turno === this.global.turno
    );

    if (vendasFrent.length > 0 || this.global.turno === "Todos") {
      if (this.global.turno === "Todos") {
        vendasFrent = this.global.listVendas;
        this.global.fechamento = vendasFrent[vendasFrent.length - 1].fechamento;
        vendasFrent.forEach((v1) =>
          v1.vendasFrentistas.forEach((vc) => {
            vendasF.push(
              new VendasFrentistas(vc.nome, vc.valorLts, vc.valorReais, vc.qtd)
            );
          })
        );

        vendasF.forEach(function (a) {
          if (!this[a.nome]) {
            this[a.nome] = new VendasFrentistas(a.nome, 0, 0, 0);
            vendasF1.push(this[a.nome]);
          }
          this[a.nome].valorLts += a.valorLts;
          this[a.nome].valorReais += a.valorReais;
        }, Object.create(null));

        this.vendasFrent = vendasF1;
      } else {
        this.vendasFrent = vendasFrent[0].vendasFrentistas;
        this.global.fechamento = vendasFrent[0].fechamento;
      }

      this.vendasFrent = this.vendasFrent.sort(
        (a, b) => a.valorReais - b.valorReais
      );
      this.totalLts = this.vendasFrent
        .map((rec) => rec.valorLts)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      this.totalReais = this.vendasFrent
        .map((rec) => rec.valorReais)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      this.totalQtd = this.vendasFrent
        .map((rec) => rec.qtd)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      let dataChart = VendasFrentistaComponent.inicializaChart();

      this.vendasFrent.forEach(function (v) {
        dataChart.addRow([
          v.nome,
          v.valorLts,
          "<div><strong>" +
            UtilService.getNomeComb(v.nome) +
            "</strong><br>" +
            v.valorLts +
            " Lts<br>R$ " +
            v.valorReais +
            "</div>",
        ]);
      });

      this.drawChart(dataChart);
    } else {
      this.vendasFrent = null;
      this.global.listTurnos = null;
    }
  }
}
