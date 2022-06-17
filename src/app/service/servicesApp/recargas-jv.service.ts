import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JV_Consumido_Ganancias, JV_Consumido_Saldo } from 'src/app/models/RecargasJV';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RecargasJVService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    getGanancias() {
        return this.http.get(`${this.url}/recargasJV/ganancias`);
    }

    getGananciasFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/recargasJV/gananciasFecha/${fechaInicio}/${fechaFin}`);
    }

    nuevaGanancia(data: JV_Consumido_Ganancias) {
        return this.http.post(`${this.url}/recargasJV/nuevaGanancia`, data);
    }

    getSaldos() {
        return this.http.get(`${this.url}/recargasJV/saldos`);
    }

    getSaldosFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/recargasJV/saldosFecha/${fechaInicio}/${fechaFin}`);
    }

    getIndicadores() {
        return this.http.get(`${this.url}/recargasJV/indicadores`);
    }

    getIndicadoresFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/recargasJV/indicadoresFecha/${fechaInicio}/${fechaFin}`);
    }

    nuevoSaldo(data: JV_Consumido_Saldo) {
        return this.http.post(`${this.url}/recargasJV/nuevoSaldo`, data);
    }
}
