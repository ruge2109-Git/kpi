import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EX_Informe_reparto } from '../../models/extractos';

@Injectable({
    providedIn: 'root'
})
export class InformeRepartoService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    getInformeReparto() {
        return this.http.get(`${this.url}/informe_reparto`);
    }

    newInformeReparto(informe_reparto: EX_Informe_reparto) {
        return this.http.post(`${this.url}/informe_reparto/nuevo`, informe_reparto);
    }
}
