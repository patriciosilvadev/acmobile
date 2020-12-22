import { Component } from "@angular/core";
import { Global } from "../../../Global";
import { UtilService } from "../../../services/utilService";
import { VendasCombustiveis } from "../vendas-combustiveis";
import { GoogleChartInterface } from "ng2-google-charts/google-charts-interfaces";
import { TabService } from "../../../services/tab-service";

declare var google;

@Component({
  selector: "page-vendas-comb-component",
  templateUrl: "vendas-comb.component.html",
  styleUrls: ["vendas-comb.component.css"],
})
export class VendasCombComponent {
  public vendasComb: VendasCombustiveis[];
  public totalLts;
  public totalReais;
  public pieChart: GoogleChartInterface;

  constructor(
    public global: Global,
    private tabService: TabService
  ) {
    // Validando consultas
    this.tabService.combAtivo().subscribe(() => {
      this.atualiza();
    });
  }

  ionViewDidEnter() {
    if (this.global.listVendas && this.global.listVendas.length > 0) {
      this.atualiza();
    } else {
      this.vendasComb = null;
      this.global.listTurnos = null;
    }
  }

  private static inicializaChart() {
    const dataChart = new google.visualization.DataTable();
    dataChart.addColumn("string", "Combustível");
    dataChart.addColumn("number", "Litros");
    dataChart.addColumn({ type: "string", role: "tooltip", p: { html: true } });

    return dataChart;
  }

  drawChart(dataChart) {
    this.pieChart = {
      chartType: "PieChart",
      dataTable: dataChart,
      options: {
        width: 300,
        height: 300,
        chartArea: { width: "100%", height: "80%" },
        legend: { position: "top", alignment: "center" },
        tooltip: { isHtml: "true" },
        pieHole: 0.4,
        colors: this.getCores(),
        animation: {
          duration: 1000,
          easing: "out",
          startup: true,
        },
      },
    };
  }

  getCores() {
    const cores = [];
    this.vendasComb.forEach(function (a) {
      cores.push(UtilService.getCores(a.nome));
    });
    return cores;
  }

  atualiza() {
    this.vendasComb = [];
    let vendasc1 = [];
    let vendasC = [];
    let vendComb = this.global.listVendas.filter(
      (vendas) => vendas.turno === this.global.turno
    );

    if (vendComb.length > 0 || this.global.turno === "Todos") {
      if (this.global.turno === "Todos") {
        vendComb = this.global.listVendas;
        this.global.fechamento = vendComb[vendComb.length - 1].fechamento;
        vendComb.forEach((v1) =>
          v1.vendasCombustiveis.forEach((vc) => {
            vendasC.push(
              new VendasCombustiveis(vc.nome, vc.valorLts, vc.valorReais)
            );
          })
        );

        vendasC.forEach(function (a) {
          if (!this[a.nome]) {
            this[a.nome] = new VendasCombustiveis(a.nome, 0, 0);
            vendasc1.push(this[a.nome]);
          }
          this[a.nome].valorLts += a.valorLts;
          this[a.nome].valorReais += a.valorReais;
        }, Object.create(null));

        this.vendasComb = vendasc1;
      } else {
        this.vendasComb = vendComb[0].vendasCombustiveis;
        this.global.fechamento = vendComb[0].fechamento;
      }

      this.vendasComb = this.vendasComb.sort((a, b) => a.valorLts - b.valorLts);
      this.totalLts = this.vendasComb
        .map((rec) => rec.valorLts)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      this.totalReais = this.vendasComb
        .map((rec) => rec.valorReais)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      let dataChart = VendasCombComponent.inicializaChart();

      this.vendasComb.forEach(function (v) {
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
        // v.nome = UtilService.getNomeComb(v.nome);
      });

      this.drawChart(dataChart);
    } else {
      this.vendasComb = null;
      this.global.listTurnos = null;
    }
  }
}
