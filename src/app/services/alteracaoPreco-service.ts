import {Injectable} from '@angular/core';
import {HttpService} from "./httpService";

@Injectable()
export class AlteracaoPrecoService {

    constructor(private _http: HttpService) {
    }

    salvarAlteracoes(alteracaoPreco: any) {
        return this._http.postHttp('alteracaoPreco/salvar', alteracaoPreco);
    }

    getAlteracoes(cnpj: String) {
        return this._http.postHttp('alteracaoPreco/listarTudo', cnpj);
    }

    removeAlteracao(id: number) {
        return this._http.getHttp('alteracaoPreco/excluir/' + id);
    }

}
