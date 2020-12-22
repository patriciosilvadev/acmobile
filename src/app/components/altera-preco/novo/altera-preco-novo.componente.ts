import {Component} from '@angular/core';
import {NgModel} from "@angular/forms";
import {Global} from "../../../Global";
import {UtilService} from "../../../services/utilService";
import {BrMaskDirective} from "br-mask";
import {BicosService} from '../../../services/bicos-service';
import {AlteracaoPrecoService} from '../../../services/alteracaoPreco-service';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {AlteraPrecoModalComponente} from '../modal/altera-preco-modal.componente';

@Component({
    selector: 'altera-preco-novo',
    templateUrl: 'altera-preco-novo.componente.html',
    styleUrls: ['altera-preco-novo.componente.css'],
    providers: [NgModel, BrMaskDirective],
})

export class AlteraPrecoNovoComponente {

    combustivelFiltro = '';
    precoAvista = false;
    bico: any;
    alteracaoPreco: any = { alteracoes: []};
    alteracao: any = {};
    listaBicosFiltrados: any[] = [];
    listaBicos: any[] = [];
    listaCombustiveis: Set<string>;

    constructor(private bicosService: BicosService,
                private alteracaoPrecoService: AlteracaoPrecoService,
                public global: Global,
                public modalController: ModalController,
                private _util: UtilService,
                public router: Router) {

        this.iniciaObjeto();
    }

    ionViewDidEnter() {
        this.bicosService.getBicos(this.global.cnpj)
            .then(dados => {
                this.listaBicos = dados;
                if (this.listaBicos.length > 0) {
                    this.listaCombustiveis = new Set(Array.from(this.listaBicos, b => b.combustivel));
                } else {
                    this._util.showMessage('Erro!', 'Erro ao buscar bicos, entre em contato com suporte!');
                    this.router.navigate(['alterar-preco/lista']);
                }
            }).catch(err => {
            this._util.showMessage('Erro!', err);
        });
    }

    filtraBico() {
        this.iniciaObjeto();
        this.listaBicosFiltrados = this.listaBicos.filter(bico => bico.combustivel === this.combustivelFiltro);
    }

    iniciaObjeto() {
        this.alteracao.bico = '';
        this.alteracao.precoAtual = undefined;
        this.alteracao.preco = undefined;
        this.alteracao.precoAvista = undefined;
        this.alteracao.alteracoes = [];
    }

    selecionaBico() {
        if (this.bico === 'Todos') {
            this.alteracao.precoAtual = this.listaBicosFiltrados[0].precoVenda.toFixed(3).replace('.', ',');
            this.alteracao.preco = '';
            this.alteracao.precoAvista = '';
            this.alteracao.bico = 'Todos';
        } else {
            this.alteracao.precoAtual = this.bico.precoVenda.toFixed(3).replace('.', ',');
            this.alteracao.preco = '';
            this.alteracao.precoAvista = '';
            this.alteracao.bico = this.bico.numero;
        }
    }

    adiciona() {
        if (this.alteracao.bico === 'Todos') {
            this.listaBicosFiltrados.forEach(b => {
                if (this.alteracaoPreco.alteracoes.filter(a => a.numero == b.numero).length > 0) {
                    this._util.showMessage('Informacao!', 'Bico ' + b.numero + ' já se encontra na lista.');
                    return;
                }
                let alteracao: any = {};
                alteracao.numero = b.numero;
                alteracao.combustivel = b.combustivel;
                alteracao.precoVenda = Number(this.alteracao.preco
                    .replace(',', '.').replace(/[^0-9\\.]+/g, ''));
                alteracao.precoAvista = Number(this.alteracao.precoAvista
                    .replace(',', '.').replace(/[^0-9\\.]+/g, ''));
                this.alteracaoPreco.alteracoes.push(alteracao);
            })
        } else {
            if (this.alteracaoPreco.alteracoes.filter(a => a.numero == Number(this.alteracao.bico)).length > 0) {
                this._util.showMessage('Informacao!', 'Bico ' + this.alteracao.bico + ' já se encontra na lista.');
                return;
            }
            let alteracao: any = {};
            alteracao.numero = Number(this.alteracao.bico);
            alteracao.precoVenda = Number(this.alteracao.preco
                .replace(',', '.').replace(/[^0-9\\.]+/g, ''));
            alteracao.precoAvista = Number(this.alteracao.precoAvista
                .replace(',', '.').replace(/[^0-9\\.]+/g, ''));
            alteracao.combustivel = this.listaBicosFiltrados.filter(a => a.numero == alteracao.numero)[0].combustivel;
            this.alteracaoPreco.alteracoes.push(alteracao);
        }

        this.iniciaObjeto();
        this.bico = undefined;

        this.alteracaoPreco.alteracoes.sort((n1, n2) => n1.numero - n2.numero);

    }

    async abreModal() {
        const modal = await this.modalController.create({
            component: AlteraPrecoModalComponente,
            componentProps: {
                'alteracao': this.alteracaoPreco
            }
        });
        await modal.present();

        return await modal.onWillDismiss();
    }

    getPreco(valor) {
        let preco = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 3
        }).format(valor.precoVenda);
        if (valor.precoAvista) {
            preco = preco + '  ' + new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 3
            }).format(valor.precoAvista);
        }
        return preco;
    }

    remove(index) {
        this.alteracaoPreco.alteracoes.splice(index, 1);
    }

    confirmar() {
        if (this.alteracaoPreco.alteracoes.length == 0) {
            this._util.showMessage('Erro!', 'É necessário adicionar alterações.');
            return;
        }

        this.abreModal().then(data => {
            if (data.data) {
                this.alteracaoPreco.data = new Date(data.data.getTime() - data.data.getTimezoneOffset() * 60000).toISOString();
                this.alteracaoPreco.cnpj = this.global.cnpj;
                this.alteracaoPreco.token = this.global.token;

                this.alteracaoPrecoService.salvarAlteracoes(this.alteracaoPreco).then(() => {
                    this._util.showToast('success', 'Agendamento efetuado com sucesso', 3000, 'bottom');
                    this.router.navigate(['alterar-preco/lista']);
                }).catch(err => {
                    this._util.showMessage('Erro!', err);
                });
            }
        });

    }

    customActionSheetOptions: any = {
        header: 'Selecione o Posto:',
    };

}
