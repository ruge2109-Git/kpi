import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TiendaOnline, TO_Producto } from '../models/tienda-online';

@Injectable({
    providedIn: 'root'
})
export class TiendaOnlineService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    //Productos
    getProductos() {
        return this.http.get(`${this.url}/productos`);
    }

    newProducto(producto: TO_Producto) {
        return this.http.post(`${this.url}/productos/nuevo`,producto);
    }

    //Tienda online
    getTiendaOnline() {
        return this.http.get(`${this.url}/tienda`);
    }

    newMovimientoTiendaOnline(tiendaOnline:TiendaOnline) {
        return this.http.post(`${this.url}/tienda/nuevo`,tiendaOnline);
    }

    getIndicadores() {
        return this.http.get(`${this.url}/tienda/indicadores`);
    }

    getRecargas() {
        return this.http.get(`${this.url}/tienda/recargas`);
    }

    getRecargasTotalizado() {
        return this.http.get(`${this.url}/tienda/recargasTotalizado`);
    }

    getDetalleRecarga(persona:string,fecha:string) {
        return this.http.get(`${this.url}/tienda/detalleRecarga/${persona}/${fecha}`);
    }

    getVentasPorPersona(persona:string,producto:string) {
        return this.http.get(`${this.url}/tienda/ventasPersonaProducto/${persona}/${producto}`);
    }

    getDetalleVenta(persona:string,producto:string) {
        return this.http.get(`${this.url}/tienda/detalleVenta/${persona}/${producto}`);
    }


}
