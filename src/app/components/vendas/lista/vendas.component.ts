import { Component, ViewChild } from "@angular/core";
import { Global } from "../../../Global";
import { UtilService } from "../../../services/utilService";
import { VendasService } from "../../../services/vendas-service";
import { Router } from "@angular/router";
import { VendasCombComponent } from "../../vendas-comb/lista/vendas-comb.component";
import { TabService } from "../../../services/tab-service";
import { IonTabs } from "@ionic/angular";

@Component({
  providers: [VendasCombComponent],
  selector: "page-vendas-component",
  templateUrl: "vendas.component.html",
  styleUrls: ["vendas.component.css"],
})
export class VendasComponent {
  @ViewChild(IonTabs, { static: false }) buttons: IonTabs;
  datePickerObj: any = this._util.iniciaDatePicker();
  datePickerObjFim: any = this._util.iniciaDatePicker();

  constructor(
    private _service: VendasService,
    public global: Global,
    private _util: UtilService,
    public router: Router,
    private tabService: TabService
  ) {}

  buscaUltimasVendas() {
    this.global.listVendas = null;
    this.global.listTurnos = null;
    this._service
      .getUltimaVenda(this.global.cnpj)
      .then((dados) => {
        this.global.dataTurno = true;
        this.global.listVendas = dados;
        if (this.global.listVendas && this.global.listVendas.length > 0) {
          this.global.data = this._util.converteDataNormal(
            this.global.listVendas[this.global.listVendas.length - 1].data
          );
          this.global.turno = this.global.listVendas[0].turno;
          this.global.fechamento = this.global.listVendas[0].fechamento;
          this.global.listTurnos = this.global.listVendas.map(
            (vendas) => vendas.turno
          );
        } else {
          this.global.listTurnos = [];
        }

        this.router.navigate(["vendas/vendasCTab"]);
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }

  atualizaData(forca) {
    let dataConsulta = this._util.converteDataIso(this.global.data);
    if (
      forca ||
      !this.global.listVendas ||
      this.global.listVendas.length < 1 ||
      this.global.listVendas[0].data != dataConsulta
    ) {
      this._service
        .getVendasPorData(
          this.global.cnpj,
          this.global.dataTurno
            ? dataConsulta
            : this._util.converteDataIso(this.global.dataInicio),
          this.global.dataTurno
            ? undefined
            : this._util.converteDataIso(this.global.dataFim)
        )
        .then((dados) => {
          this.global.listVendas = dados;
          if (this.global.listVendas.length > 0) {
            this.global.listTurnos = this.global.listVendas.map(
              (vendas) => vendas.turno
            );
            this.global.turno = this.global.listTurnos[0];
          } else {
            this.global.listTurnos = [];
            this.global.turno = null;
          }

          this.atualiza();
        })
        .catch((err) => {
          this._util.showMessage("Erro", err);
        });
    }
  }

  atualiza() {
    this.tabService.ativaComponente(this.router.url);
  }

  trocaData() {
    this.global.dataTurno = !this.global.dataTurno;
    if (this.global.dataTurno) {
      this.atualizaData(true);
    } else {
      this.global.dataInicio = this.global.data;
      this.global.dataFim = this.global.data;
      this.global.turno = "Todos";
      this.setaDataInicio();
    }
  }
  
  setaDataInicio() {
    this.datePickerObjFim.fromDate = new Date(
      this._util.converteDataIso(this.global.dataInicio) + "T10:00:00"
    );
  }

  ionViewDidEnter() {
    this.buscaUltimasVendas();
  }

  customActionSheetOptions: any = {
    header: "Selecione o Posto:",
  };
}
