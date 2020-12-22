import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {Global} from "../../../Global";
import {UtilService} from "../../../services/utilService";
import {AlteracaoPrecoService} from '../../../services/alteracaoPreco-service';
import {Router} from '@angular/router';

@Component({
    selector: 'altera-preco-lista',
    templateUrl: 'altera-preco-lista.componente.html',
    styleUrls: ['altera-preco-lista.componente.css']
})

export class AlteraPrecoListaComponente {

    listaAlteracaoPreco: any[] = [];
    listaOriginal: any[] = [];
    shownGroup = null;
    public filtro= 'PENDENTE';
    public alertShown: boolean = false;

    constructor(private alertCtrl: AlertController,
                public router: Router,
                public global: Global,
                private _util: UtilService,
                private alteracaoPrecoService: AlteracaoPrecoService) {
    }

    ionViewDidEnter() {
        this.listar();
    }

    customActionSheetOptions: any = {
        header: 'Selecione o Posto:',
    };

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

    listar() {
        this.alteracaoPrecoService.getAlteracoes(this.global.cnpj)
            .then(dados => {
                this.listaOriginal = dados;
                this.filtro= 'PENDENTE';
                this.filtraStatus();
            }).catch(err => {
            this._util.showMessage('Erro!', err);
        });

    }

    async presentConfirm(registro) {
        let alert = await this.alertCtrl.create({
            header: 'Confirmação',
            message: 'Deseja cancelar o agendamento?',
            buttons: [
                {
                    text: 'Cancela',
                    role: 'cancel',
                    handler: () => {
                        this.alertShown = false;
                    }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.remove(registro)
                    }
                }
            ]
        });
        await alert.present().then(() => {
            this.alertShown = true;
        });
    }

    remove(registro) {
        this.alteracaoPrecoService.removeAlteracao(registro.id)
            .then(dados => {
                this._util.showToast('danger', 'Agendamento removido com sucesso', 3000, 'bottom');
                this.shownGroup = null;
                this.listar();
            }).catch(err => {
            this._util.showMessage('Erro!', err);
        });
    }

    filtraStatus() {
        if (this.listaOriginal && this.listaOriginal.length > 0) {
            this.listaAlteracaoPreco = this.listaOriginal.map(x => Object.assign({}, x));
            this.listaAlteracaoPreco = this.listaAlteracaoPreco.filter(value => value.status === this.filtro);
        }else{
            this.listaAlteracaoPreco = null;
        }
        this.shownGroup = null;
    }

    criarNovo() {
        this.router.navigate(['alterar-preco/novo']);
    }

    toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    };

    isGroupShown(group) {
        return this.shownGroup === group;
    };

    getStatus(status, group) {
        if (this.isGroupShown(group)) {
            return null;
        }
        switch (status) {
            case 'SUCESSO':
                return '#609F63';
            case 'PENDENTE':
                return '#FFB82B';
            case 'CANCELADO':
                return '#9f2209';
        }
    }

}
