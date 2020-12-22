import {Injectable} from '@angular/core';
import {HttpService} from "./httpService";

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {

    constructor(private _http: HttpService) {
    }

    public efetuaLogin(login: string, senha: string, cnpjs : string[]) {
        return this._http.postHttp('usuarioApp/login', {'login': login, 'senha': senha, 'listaCnpj': cnpjs});
    }

    public registrar(usuario: any) {
        return this._http.postHttp('usuarioApp/registrarNovo', {
            'login': usuario.login,
            'senha': usuario.senha,
            'id': usuario.id,
            'listaCnpj': usuario.listaCnpj,
        });
    }

    public senha(cnpj: string, senha: string) {
        return this._http.postHttp('usuarioApp/resetSenha', {'senha': senha, 'login': cnpj});
    }

}
