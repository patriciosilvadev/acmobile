import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TabService {
    private subject = new Subject<any>();

    ativaComponente(componente: string) {
        this.subject.next({text: componente});
    }

    private getComponente(componente): Observable<any> {
        return this.subject.asObservable().pipe(filter(comp =>
            comp.text === componente
        ));
    }

    combAtivo(): Observable<any> {
        return this.getComponente('/vendas/vendasCTab');
    }

    frentAtivo(): Observable<any> {
        return this.getComponente('/vendas/vendasFTab');
    }

    prodAtivo(): Observable<any> {
        return this.getComponente('/vendas/vendasPTab');
    }

    totAtivo(): Observable<any> {
        return this.getComponente('/vendas/vendasTTab');
    }

}