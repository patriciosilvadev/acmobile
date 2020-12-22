// import {Component} from '@angular/core';
// import {UtilService} from "../../services/utilService";
// import {Global} from "../../Global";
// import {VendasHora} from '../vendas-hora';
// import {VendasService} from '../../vendas/vendas-service';
// import {GoogleChartInterface} from 'ng2-google-charts/google-charts-interfaces';
//
// declare var google;
//
// @Component({
//   selector: 'page-vendas-hora',
//   templateUrl: 'vendas-hora.component.html',
//   styleUrls: ['vendas-hora.component.css']
// })
//
// export class VendasHoraComponent {
//
//   public lineChart: GoogleChartInterface;
//   public vendasHora: VendasHora[];
//   public dataHora: number[];
//   public labelHora: string[];
//   public totalLts;
//   public totalReais;
//   public mostrar: boolean = true;
//
//   constructor(private _service: VendasService,
//               private _utilService: UtilService,
//               public global: Global) {
//   }
//
//   ionViewDidEnter() {
//     if (this.global.listVendas && this.global.listVendas.length > 0) {
//       this.atualiza();
//     } else {
//       this.vendasHora = null;
//       this.dataHora = null;
//       this.labelHora = null;
//       this.global.listTurnos = null;
//       this.mostrar = false;
//     }
//   }
//
//   drawChart(dataChart) {
//     this.lineChart = {
//       chartType: 'LineChart',
//       dataTable: dataChart,
//       //opt_firstRowIsData: true,
//       options: {
//         width: 320,
//         height: 320,
//         chartArea: {width: '100%', height: '80%'},
//         legend: {position: 'top', alignment: 'center'},
//         tooltip: {isHtml: 'true'},
//         animation: {
//           duration: 1000,
//           easing: 'out',
//           startup: true
//         }
//       }
//     };
//   }
//
//   atualiza() {
//     this.mostrar = true;
//     this.vendasHora = [];
//     let vendasF1 = [];
//     let vendasF = [];
//     let vendasHora = this.global.listVendas.filter(vendas => (vendas.data === this.global.data && vendas.turno === this.global.turno));
//
//     if (vendasHora.length > 0 || this.global.turno === 'Todos') {
//       if (this.global.turno === 'Todos') {
//         vendasHora = this.global.listVendas.filter(vendas => (vendas.data === this.global.data));
//         vendasHora.forEach(v1 => v1.vendasHora.forEach(vc => {
//           vendasF.push(new VendasHora(vc.hora, vc.valorLts, vc.valorReais));
//         }));
//
//         vendasF.forEach(function (a) {
//           if (!this[a.hora]) {
//             this[a.hora] = new VendasHora(a.hora, 0, 0);
//             vendasF1.push(this[a.hora]);
//           }
//           this[a.hora].valorLts += a.valorLts;
//           this[a.hora].valorReais += a.valorReais;
//         }, Object.create(null));
//
//         this.vendasHora = vendasF1;
//
//       } else {
//         this.vendasHora = vendasHora[0].vendasHora;
//       }
//
//       this.vendasHora.sort((a, b) => parseInt(a.hora) - parseInt(b.hora));
//
//       // //Grafico Pizza
//       // this.dataHora = this.vendasHora.map(vendas => vendas.valorLts);
//       // this.labelHora = this.vendasHora.map(vendas => vendas.hora);
//       //
//       // this.totalLts = this.vendasHora.map(rec => rec.valorLts).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//       // this.totalReais = this.vendasHora.map(rec => rec.valorReais).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//
//       let dataChart = this.inicializaChart();
//       this.vendasHora.forEach(function (v) {
//         dataChart.addRow([
//           v.hora,
//           v.valorLts,
//           '<div><strong>' + v.hora + '</strong><br>' + v.valorLts + ' Lts<br>R$ ' + v.valorReais + '</div>']);
//       });
//
//     } else {
//       this.vendasHora = null;
//       this.dataHora = null;
//       this.labelHora = null;
//       this.global.listTurnos = null;
//       this.mostrar = false;
//     }
//   }
//
//   private inicializaChart() {
//     const dataChart = new google.visualization.DataTable();
//     dataChart.addColumn('string', 'Hora');
//     dataChart.addColumn('number', 'Litros');
//     dataChart.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
//
//     return dataChart;
//   }
//
//   selecionaData() {
//     this._utilService.selecionaDataNativa()
//       .then(data => {
//         this.global.data = data;
//         let dataT: Date = new Date(this.global.data);
//         let dataC: Date = new Date(this.global.dataConsulta);
//
//         if (dataT < dataC) {
//           this.global.dataConsulta = this.global.data;
//           this._service.getVendasPorData(this.global.cnpj, this.global.dataConsulta)
//             .then(dados => {
//               this.global.listVendas = dados;
//               if (this.global.listVendas.length > 0) {
//                 this.global.listTurnos = this.global.listVendas.filter(vendas => (vendas.data === this.global.data)).map(vendas => vendas.turno);
//                 this.global.turno = this.global.listTurnos[0];
//               } else {
//                 this.global.listTurnos = [];
//                 this.global.turno = null;
//               }
//               this.atualiza();
//             }).catch(err => {
//             this._utilService.showMessage('Erro!',err);
//           });
//         } else {
//           this.global.listTurnos = this.global.listVendas.filter(vendas => (vendas.data === this.global.data)).map(vendas => vendas.turno);
//           this.global.turno = this.global.listTurnos[0];
//           this.atualiza();
//         }
//       });
//   }
// }