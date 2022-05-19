import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EXR_Extracto_recargas } from '../models/Ext_recarga';

@Injectable({
  providedIn: 'root'
})
export class ExtrctoRecargasService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    getExtractoRecarga() {
        return this.http.get(`${this.url}/extractoRecarga`);
    }

    getExtractoRecargaPorFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoRecargaPorFecha/${fechaInicio}/${fechaFin}`);
    }


    newExtractoRecarga(extractoRecarga: EXR_Extracto_recargas) {
        return this.http.post(`${this.url}/extractoRecarga/nuevo`, extractoRecarga);
    }

    getIndicadores() {
        return this.http.get(`${this.url}/extractoRecarga/indicadores`);
    }

    getIndicadoresPorFecha(fechaInicio: string, fechaFin: string) {
        return this.http.get(`${this.url}/extractoRecarga/indicadoresFecha/${fechaInicio}/${fechaFin}`);
    }


}
