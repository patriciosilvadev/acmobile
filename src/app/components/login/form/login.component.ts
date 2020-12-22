import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {UsuarioService} from "../../../services/usuario-service";
import {UtilService} from "../../../services/utilService";
import {Global} from '../../../Global';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'page-login-component',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent {

    public login: string;
    public senha: string;
    public cnpj: string;

    constructor(public menuCtrl: MenuController,
                private _service: UsuarioService,
                public router: Router,
                private _util: UtilService,
                public global: Global,
                private storage: Storage) {

        this.storage.get('usario').then((value) => {
            if (value && value.login) {
                this.login = value.login;
                if ('suporte@autocomsistemas.com.br' != this.login) {
                    this.senha = value.senha;
                    this.efetuaLogin();
                }
            }
        }).catch(error => this._util.showMessage('Erro!', error));

        this.storage.get('login').then((value) => {
            this.login = value;
        }).catch(error => this._util.showMessage('Erro!', error));

        this.menuCtrl.enable(false, 'appMenu');
    }

    efetuaLogin() {
        if (this.senha == this._util.getSenhaCripto()) {
            this.senha = null;
        }
        this._service
            .efetuaLogin(this.login, this.senha, [this.cnpj ? this.cnpj.toString().replace(/[^\d]+/g,'') : undefined]).then(dados => {
            this.menuCtrl.enable(true, 'appMenu');
            this.router.navigate(['/home']);
            this.global.usuario = dados;
            this.global.usuario.senha = this.senha;
            this.global.cnpj = this.global.usuario.clientes[0].cnpj;
            this.storage.set(`usario`, this.global.usuario);
            this.storage.set(`login`, this.login);
        }).catch(err => {
            this._util.showMessage('Erro!', err);
        });
    }

    abre(pagina) {
        if (pagina === 'registrar') {
            this.global.usuario = undefined;
            this.router.navigate(['/conta']);
        } else {
            this.router.navigate(['/senha']);
        }
    }
}
