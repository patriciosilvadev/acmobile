import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Global } from "src/app/Global";
import { DreService } from "src/app/services/dre.service";
import { UtilService } from "src/app/services/utilService";

@Component({
  selector: "app-outras-receitas",
  templateUrl: "./outras-receitas.component.html",
  styleUrls: ["./outras-receitas.component.scss"],
})
export class OutrasReceitasModalComponent {
  public shownGroup = null;
  public filtro;
  public mesEscolhido;
  public listaCreditos: any;
  public totalGeral: any;
  public dataInicio: any;
  public dataFinal: any;

  constructor(
    private modalController: ModalController,
    private service: DreService,
    private global: Global,
    private _util: UtilService
  ) {}

  ngOnInit() {
    let filtro = this._util.filtrarDatasDre(this.filtro);
    this.dataInicio = this._util.converteDataNormal(filtro.inicio);
    this.dataFinal = this._util.converteDataNormal(filtro.final);
    this.getCred(filtro.inicio, filtro.final);
  }

  getCred(inicio, final) {
    this.service
      .getCreditos(this.global.cnpj, inicio, final)
      .then((dados) => {
        this.listaCreditos = this.organizaLista(UtilService.sortListById(dados));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  organizaLista(lista) {
    lista.forEach((e) => {
      e.data = this._util.converteDataNormal(e.data);
    });
    this.totalGeral = lista
      .map((rec) => rec.valor)
      .reduce((acc, currValue) => acc + currValue, 0);
    return lista;
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
