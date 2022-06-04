import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MiEn_Movimientos } from '../models/MiEntretenimiento';

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
}
