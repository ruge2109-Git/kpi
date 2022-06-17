import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MiEn_Movimientos, MIEn_Respuesta } from '../../models/MiEntretenimiento';

@Injectable({
  providedIn: 'root'
})
export class MiEntretenimientoService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    getData() {
        return this.http.get(`${this.url}/miEntretenimiento`);
    }

    newMovimiento(miEntretenimiento: MiEn_Movimientos) {
        return this.http.post(`${this.url}/miEntretenimiento/nuevo`, miEntretenimiento);
    }

    getDataRespuesta() {
        return this.http.get(`${this.url}/miEntretenimientoRespuesta`);
    }

    newRespuesta(miEntretenimiento: MIEn_Respuesta) {
        return this.http.post(`${this.url}/miEntretenimientoRespuesta/nuevo`, miEntretenimiento);
    }

    getIndicadores() {
        return this.http.get(`${this.url}/miEntretenimiento/indicadores`);
    }

    getIndicadoresFecha(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/miEntretenimiento/indicadoresFecha/${fechaIni}/${fechaFin}`);
    }
}
