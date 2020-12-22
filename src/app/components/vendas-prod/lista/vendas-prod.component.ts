import { Component, ViewChild } from "@angular/core";
import { IonContent } from "@ionic/angular";
import { Global } from "../../../Global";
import { Router } from "@angular/router";
import { TabService } from "../../../services/tab-service";

@Component({
  selector: "page-vendas-prod-component",
  templateUrl: "vendas-prod.component.html",
  styleUrls: ["vendas-prod.component.css"],
})
export class VendasProdComponent {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  public vendasGrupo: any[] = [];
  public vendasProd: any[] = [];
  public dataGrafico: any[] = [];
  public shownGroup = null;
  public totalReais;
  public existeVendas: boolean = true;

  constructor(
    public global: Global,
    public router: Router,
    private tabService: TabService
  ) {
    // Validando consultas
    this.tabService.prodAtivo().subscribe(() => {
      this.atualiza();
      this.existeVendas = this.vendasProd.length == 0 ? false : true;
    });
  }

  ionViewDidEnter() {
    if (this.global.listVendas && this.global.listVendas.length > 0) {
      this.atualiza();
      this.existeVendas = this.vendasProd.length == 0 ? false : true;
    } else {
      this.vendasProd = null;
      this.global.listTurnos = null;
    }
  }

  atualiza() {
    this.vendasProd = [];
    let vendasc1 = [];
    let vendasC = [];
    let vendProd = this.global.listVendas.filter(
      (vendas) => vendas.turno === this.global.turno
    );

    if (vendProd.length > 0 || this.global.turno === "Todos") {
      if (this.global.turno === "Todos") {
        vendProd = this.global.listVendas;
        this.global.fechamento = vendProd[vendProd.length - 1].fechamento;
        vendProd.forEach((v1) =>
          v1.vendasProdutos.forEach((vc) => {
            vendasC.push({
              grupo: vc.grupo,
              descricao: vc.descricao,
              quantidade: vc.quantidade,
              total: vc.total,
            });
          })
        );

        vendasC.forEach(function (a) {
          if (!this[a.grupo]) {
            this[a.grupo] = {
              grupo: a.grupo,
              descricao: a.descricao,
              quantidade: 0,
              total: 0,
            };
            vendasc1.push(this[a.grupo]);
          }
          this[a.grupo].quantidade += a.quantidade;
          this[a.grupo].total += a.total;
        }, Object.create(null));

        this.vendasProd = vendasc1;
      } else {
        this.vendasProd = vendProd[0].vendasProdutos;
        this.global.fechamento = vendProd[0].fechamento;
      }

      this.vendasProd = this.vendasProd.sort((a, b) => b.total - a.total);
      this.totalReais = this.vendasProd
        .map((rec) => rec.total)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      this.groupBy();
    } else {
      this.vendasProd = null;
      this.global.listTurnos = null;
    }
  }

  groupBy() {
    let resultado = [];
    this.vendasProd.reduce(function (res, value) {
      if (!res[value.grupo]) {
        res[value.grupo] = { nome: value.grupo, vendas: [value] };
        resultado.push(res[value.grupo]);
      } else {
        res[value.grupo].vendas.push(value);
      }
      return res;
    }, {});

    this.vendasGrupo = resultado.sort(
      (a, b) => +(a.nome > b.nome) - +(a.nome < b.nome)
    );

    let dados = [];
    this.vendasGrupo.forEach((group) => {
      group.totalQtd = group.vendas
        .map((rec) => rec.quantidade)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      group.totalReais = group.vendas
        .map((rec) => rec.total)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      dados.push({
        name: group.nome,
        value: group.totalReais,
      });
    });

    this.dataGrafico = [...dados];
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

  formataLabel(valor) {
    return `<small class="number-card-label">${valor.label}</small>`;
  }

  formataValor(valor) {
    if (valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor.value.toFixed(2));
    } else {
      valor;
    }
  }
}
