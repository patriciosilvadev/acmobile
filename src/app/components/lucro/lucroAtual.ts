import {Lucro} from "./lucro";

export class LucroAtual {

    constructor(
      public cnpj: string,
      public lucro: Lucro[],
      public dataHora: Date
      ) {}
}
