import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";
import { Estoque } from "../components/estoque/estoque";
import * as moment from "moment";


@Injectable({
  providedIn: "root",
})
export class UtilService {
  constructor(
    public alertCtrl: AlertController,
    public toastController: ToastController
  ) {}

  async showToast(cor, msg, duracao, posicao) {
    const toast = await this.toastController.create({
      color: cor,
      message: msg,
      duration: duracao,
      position: posicao,
    });
    toast.present();
  }

  iniciaDatePicker() {
    return {
      fromDate: new Date(new Date().setDate(new Date().getDate() - 60)),
      toDate: new Date(),
      closeOnSelect: true,
      setLabel: "Selecione",
      todayLabel: "Hoje",
      closeLabel: "Fechar",
      titleLabel: "Selecione a Data",
      monthsList: [
        "Jan",
        "Fev",
        "Mar",
        "Abril",
        "Maio",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
      dateFormat: "DD/MM/YYYY",
      momentLocale: "pt-BR",
      clearButton: false,
    };
  }

  agruparLista(lista, propriedade) {
    return lista.reduce((acc, obj) => {
      let key = obj[propriedade];
      if (!acc[key]) acc[key] = [];
      acc[key].push(obj);
      return acc;
    }, {});
  }

  converteDataIso(date) {
    let dataString = date.split("/");
    let data = new Date(
      dataString[2],
      dataString[1] - 1,
      dataString[0],
      10,
      0,
      0,
      0
    );
    return data.toISOString().substring(0, 10);
  }

  converteDataNormal(date) {
    let data = new Date(date + "T10:00:00");
    return data.toLocaleDateString("pt-BR");
  }

  filtrarDatasDre(qtdDias) {
    if (qtdDias >= 15) {
      const inicio = this.converteDataIso(
        moment()
          .subtract(qtdDias - 1, "days")
          .format("DD/MM/YYYY")
      );
      const final = this.converteDataIso(moment().format("DD/MM/YYYY"));
      return { inicio, final };
    } else {
      const inicio = this.converteDataIso(
        moment()
          .subtract(qtdDias + 1, "months")
          .startOf("month")
          .format("DD/MM/YYYY")
      );
      const final = this.converteDataIso(
        moment()
          .subtract(qtdDias + 1, "months")
          .endOf("month")
          .format("DD/MM/YYYY")
      );
      return { inicio, final };
    }
  }

  configurarImgEstoque(listaEstoque) {
    listaEstoque.forEach((est, index) => {
      let cores = this.getColorTanque(est);
      est.porcentagem = parseInt(est.porcentagem);
      est.color = cores.main;
      est.colorBack = cores.back;
      est.elementId = "tanque" + index;
    });
  }

  static getNomeComb(sigla) {
    switch (sigla) {
      case "GC":
        return "Gasolina Comum";
      case "GA":
        return "Gasolina Aditivada";
      case "GP":
        return "Gasolina Podium";
      case "AC":
      case "EC":
        return "Etanol Comum";
      case "EA":
      case "AA":
        return "Etanol Aditivado";
      case "D5":
        return "Diesel Comum";
      case "D0":
        return "Diesel Aditivado";
      case "D1":
        return "Diesel S10 Comum";
      case "D2":
        return "Diesel S10 Aditivado";
      case "GN":
        return "Gás Natural";
      case "QR":
        return "Querozene";
      default:
        return sigla;
    }
  }

  private getColorTanque(estoque) {
    let color = { main: "", back: "" };

    switch (estoque.combustivel) {
      case "GC":
        color.main = "#ffeb3b";
        color.back = "#f9a825";
        break;
      case "GA":
      case "GP":
      case "GN":
      case "QR":
        color.main = "#f44336";
        color.back = "#b71c1c";
        break;
      case "AC":
      case "AA":
        color.main = "#4caf50";
        color.back = "#1b5e20";
        break;
      case "D5":
      case "D0":
        color.main = "#3f51b5";
        color.back = "#1a237e";
        break;
      case "D1":
      case "D2":
        color.main = "#ff9800";
        color.back = "#e65100";
        break;
    }

    return color;
  }

  static getCores(sigla) {
    switch (sigla) {
      case "GC":
        return "#ffeb3b";
      case "GA":
      case "GP":
      case "GN":
      case "QR":
        return "#f44336";
      case "AC":
      case "AA":
        return "#4caf50";
      case "D5":
      case "D0":
        return "#3f51b5";
      case "D1":
      case "D2":
        return "#ff9800";
    }
  }

  static getClassEstoque(sigla) {
    switch (sigla) {
      case "GC":
        return "card-tank-amarelo";
      case "GA":
      case "GP":
      case "GN":
      case "QR":
        return "card-tank-vermelho";
      case "AC":
      case "AA":
      case "EC":
        return "card-tank-verde";
      case "D5":
      case "D0":
        return "card-tank-azul";
      case "D1":
      case "D2":
        return "card-tank-laranja";
    }
  }

  static getImgEstoque(estoque: Estoque) {
    let img = "assets/image/";

    switch (estoque.combustivel) {
      case "GC":
        img = img + "amarelo";
        break;
      case "GA":
        img = img + "vermelho";
        break;
      case "GP":
        img = img + "vermelho";
        break;
      case "AC":
      case "EC":
        img = img + "verde";
        break;
      case "AA":
      case "EA":
        img = img + "verde";
        break;
      case "D5":
        img = img + "azul";
        break;
      case "D0":
        img = img + "azul";
        break;
      case "D1":
        img = img + "azul";
        break;
      case "D2":
        img = img + "azul";
        break;
      case "GN":
        img = img + "vermelho";
        break;
      case "QR":
        img = img + "vermelho";
        break;
    }

    if (estoque.porcentagem < 33) {
      img = img + "-baixo.png";
    } else if (estoque.porcentagem < 66) {
      img = img + "-medio.png";
    } else {
      img = img + "-alto.png";
    }
    return img;
  }

  static getClassCoresComb(sigla) {
    switch (sigla) {
      case "GC":
        return "border-comb-amar";
      case "GA":
      case "GP":
      case "GN":
      case "QR":
        return "border-comb-verm";
      case "AC":
      case "AA":
        return "border-comb-verde";
      case "D5":
      case "D0":
        return "border-comb-azul";
      case "D1":
      case "D2":
        return "border-comb-laran";
    }
  }

  static sortListById(list) {
    return list.sort((a, b ) => a.id - b.id);
  }

  static getChartColors() {
    let customColors = [
      {
        name: "GC",
        value: "#ffeb3b",
      },
      {
        name: "GA",
        value: "#f44336",
      },
      {
        name: "GP",
        value: "#f44336",
      },
      {
        name: "GN",
        value: "#f44336",
      },
      {
        name: "QR",
        value: "#f44336",
      },
      {
        name: "AC",
        value: "#4caf50",
      },
      {
        name: "EC",
        value: "#4caf50",
      },
      {
        name: "EA",
        value: "#4caf50",
      },
      {
        name: "AA",
        value: "#4caf50",
      },
      {
        name: "D1",
        value: "#ff9800",
      },
      {
        name: "D2",
        value: "#D78000",
      },
      {
        name: "D5",
        value: "#3f51b5",
      },
      {
        name: "D0",
        value: "#3f51b5",
      },
    ];

    return customColors;
  }

  static random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static formatterBRL(valor) {
    if (valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor.toFixed(4));
    } else {
      return valor;
    }
  }

  async showMessage(titulo, msg) {
    let m: string;
    if (msg instanceof Object) {
      if (msg.error && !(msg.error instanceof Object)) {
        m = msg.error;
      } else {
        m = msg.message;
      }
    } else {
      m = msg;
    }
    let modal = await this.alertCtrl.create({
      subHeader: titulo,
      message: m,
      buttons: ["OK"],
    });

    await modal.present();
  }

  getSenhaCripto() {
    let data = new Date();
    return data
      .toDateString()
      .split("")
      .map((c) => c.charCodeAt(0).toString(data.getDate() + 1))
      .join("")
      .substring(0, 6);
  }
}
