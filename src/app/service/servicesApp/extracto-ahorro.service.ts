import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EXA_Extracto_ahorro } from '../../models/CtaAhorro';

@Injectable({
    providedIn: 'root'
})
export class ExtractoAhorroService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    getExtractoAhorro() {
        return this.http.get(`${this.url}/extractoAhorro`);
    }

    newExtractoAhorro(extractoAhorro: EXA_Extracto_ahorro) {
        return this.http.post(`${this.url}/extractoAhorro/nuevo`, extractoAhorro);
    }

    getExtractoAhorroPorFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoAhorro/filtroFecha/${fechaInicio}/${fechaFin}`);
    }

    getIndicadores() {
        return this.http.get(`${this.url}/extractoAhorro/indicadores`);
    }

    getIndicadoresPorFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoAhorro/indicadoresFecha/${fechaInicio}/${fechaFin}`);
    }

    getIngresos(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoAhorro/totalIngresos/${fechaInicio}/${fechaFin}`);
    }

    getEgresos(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoAhorro/totalEgresos/${fechaInicio}/${fechaFin}`);
    }
    getSinComisiones(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoAhorro/sinComisiones/${fechaInicio}/${fechaFin}`);
    }
}
