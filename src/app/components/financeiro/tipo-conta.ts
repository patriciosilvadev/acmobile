export enum TipoConta {
    PAGAR,
    RECEBER
}

export namespace TipoConta {
    export function toString(tipo: TipoConta): string {
        return TipoConta[tipo];
    }

    export function parse(tipo: string): TipoConta {
        return TipoConta[tipo];
    }

}
