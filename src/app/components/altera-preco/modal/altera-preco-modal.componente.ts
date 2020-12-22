import {Component, Input} from "@angular/core";
import {UtilService} from "../../../services/utilService";
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'altera-preco-modal',
    templateUrl: 'altera-preco-modal.componente.html'
})

export class AlteraPrecoModalComponente {

    data: string;
    dataMin: string;

    @Input() alteracao: any;

    constructor(private _util: UtilService,
                public modalController: ModalController) {
        let datahora: Date = new Date();
        datahora.setMinutes(datahora.getMinutes() + 20);
        this.dataMin = new Date(datahora.getTime() - datahora.getTimezoneOffset() * 60000).toISOString();
        this.data = undefined
    }

    confirmar() {
        if (!this.data) {
            this._util.showMessage('Erro!', 'É necessário informar a data!');
            return;
        }
        this.modalController.dismiss(new Date(this.data));
    }

    cancelar() {
        this.modalController.dismiss(undefined);
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
}
