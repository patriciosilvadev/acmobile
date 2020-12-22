import {Vendas} from './components/vendas/vendas';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Global {

    public versao:string = '1.0.5';
    public token:string;
    public cnpj: string;
    public posto: string;
    public data: string;
    public turno: string;
    public fechamento: string;
    public listVendas: Vendas[];
    public listTurnos: string[];
    public logo: string = 'assets/image/Autocom.png';
    public logoBranco: string = 'assets/image/AutocomBranco.png';
    public root: boolean = true;
    public usuario: any;
    public dataTurno: boolean = true;
    public dataInicio;
    public dataFim;
}
