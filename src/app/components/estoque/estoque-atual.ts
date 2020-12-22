import {Estoque} from "./estoque";

export class EstoqueAtual {

    constructor(
      public cnpj: string,
      public estoque: Estoque[],
      public dataHora: Date
      ) {}
}
