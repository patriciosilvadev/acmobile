import {Component} from '@angular/core';
import {Global} from '../../../Global';
import {UtilService} from '../../../services/utilService';
import {VendasService} from '../../../services/vendas-service';
import {Router} from '@angular/router';
import {VendasCombustiveis} from '../../vendas-comb/vendas-combustiveis';
import {TabService} from '../../../services/tab-service';

@Component({
    selector: 'page-vendas-tot-component',
    templateUrl: 'vendas-tot.component.html',
    styleUrls: ['vendas-tot.component.scss'],
})

export class VendasTotComponent {

    public dataGrafico: any[] = [];

    constructor(private _utilService: UtilService,
                public global: Global,
                private _service: VendasService,
                public router: Router,
                private tabService: TabService) {

        // Validando consultas
        this.tabService.totAtivo()
            .subscribe(() => {
                this.atualiza();
            });
    }

    ionViewDidEnter() {
        if (this.global.listVendas && this.global.listVendas.length > 0) {
            this.atualiza();
        } else {
            this.dataGrafico = [];
            this.global.listTurnos = null;
        }

    }

    atualiza() {
        this.dataGrafico = [];
        let vendasProd = [];
        let vendasComb = [];
        let totais = this.global.listVendas.filter(vendas => (vendas.turno === this.global.turno));

        if (totais.length > 0 || this.global.turno === 'Todos') {
            if (this.global.turno === 'Todos') {
                totais = this.global.listVendas;
                this.global.fechamento = totais[totais.length - 1].fechamento;
                totais.forEach(v1 => {
                    v1.vendasProdutos.forEach(vc => {
                        vendasProd.push({
                            grupo: vc.grupo,
                            descricao: vc.descricao,
                            quantidade: vc.quantidade,
                            total: vc.total
                        })
                    });
                    v1.vendasCombustiveis.forEach(vc => {
                        vendasComb.push(new VendasCombustiveis(vc.nome, vc.valorLts, vc.valorReais));
                    });
                });
            }else{
                vendasProd = totais[0].vendasProdutos;
                vendasComb = totais[0].vendasCombustiveis;
                this.global.fechamento = totais[0].fechamento;
            }

        } else {
            vendasProd = totais[0].vendasProdutos;
            vendasComb = totais[0].vendasCombustiveis;
            this.global.fechamento = totais[0].fechamento;
        }

        let totalComb = vendasComb.map(rec => rec.valorReais).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        let totalProd = vendasProd.map(rec => rec.total).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        this.dataGrafico = [
            {name: "Combustíveis", value: totalComb},
            {name: "Produtos", value: totalProd}
        ]

    }

    formataValor(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor.toFixed(2));
    }
    formataPercent(valor) {
        return 0;
    }

}
