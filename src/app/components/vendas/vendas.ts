import {VendasFrentistas} from '../vendas-frentista/vendas-frentistas';
import {VendasCombustiveis} from '../vendas-comb/vendas-combustiveis';
import {VendasHora} from '../vendas-hora/vendas-hora';

export class Vendas {

    constructor(
      public data: string,
      public turno: string,
      public cnpj: string,
      public fechamento: string,
      public vendasFrentistas: VendasFrentistas[],
      public vendasCombustiveis: VendasCombustiveis[],
      public vendasProdutos: any[],
      public vendasHora: VendasHora[]
      ) {}
}
