import {Component} from '@angular/core';
import {Global} from "../../Global";
import {UtilService} from "../../services/utilService";
import {Router} from '@angular/router';

@Component({
    selector: 'page-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {

    public paginas = [
        {titulo: 'Vendas', componente: '/vendas'},
        {titulo: 'Estoque Tanques', componente: '/estoque'},
        {titulo: 'Caixa', componente: '/caixa'},
        {titulo: 'Lucro', componente: '/lucro'},
        {titulo: 'Alterar Preço', componente: '/alterar-preco/lista'},
        {titulo: 'Financeiro', componente: '/contas'},
        {titulo: 'DRE (Lucro Bruto)', componente: '/relatorios/dre'},        
    ];

    constructor(public global: Global,
                public router: Router,
                private _util: UtilService) {
    }

    ionViewDidEnter() {
        if (this.global.cnpj.length !== 14) {
            this.global.cnpj = this.global.usuario.clientes[0].cnpj;
        }
    }

    abrePagina(pagina) {
        this.global.root = true;
        this.router.navigate([pagina.componente]);
    }

    customActionSheetOptions: any = {
        header: 'Selecione o Posto:',
    };
}


