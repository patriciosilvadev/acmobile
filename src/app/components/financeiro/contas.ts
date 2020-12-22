import {TipoConta} from './tipo-conta';

export class Contas {
    constructor(
        public cnpj: string,
        public tipo: TipoConta,
        public descricao: string,
        public valor: number
    ) {
    }
}
