import { Component } from "@angular/core";
import { PopoverController } from '@ionic/angular';

@Component({
  selector: "app-filtro-data",
  templateUrl: "./filtro-data.component.html",
  styleUrls: ["./filtro-data.component.scss"],
})
export class FiltroDataComponent{
  private monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  public mesAno : any[] = []

  constructor(private popoverController: PopoverController) {
    this.listaMesAno();
  }

  listaMesAno() {
    let today = new Date();
    let d : Date;
    let month;
    let year;

    for (var i = 3; i >= 1; i--) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      month = this.monthNames[d.getMonth()];
      year = d.getFullYear();
      this.mesAno.push(month + '/' + year);
    }
    this.mesAno.reverse();
  }

  alteraData(res, label){
    let response = {date: res, label: label};
    this.popoverController.dismiss(response);
  }
}
