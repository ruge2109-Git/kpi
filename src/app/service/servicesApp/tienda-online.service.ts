import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TiendaOnline, TO_Producto } from '../../models/tienda-online';

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
        return this.http.post(`${this.url}/productos/nuevo`, producto);
    }

    updateProducto(producto: TO_Producto) {
        return this.http.put(`${this.url}/productos/actualizar`, producto);
    }

    //Tienda online
    getTiendaOnline() {
        return this.http.get(`${this.url}/tienda`);
    }

    newMovimientoTiendaOnline(tiendaOnline: TiendaOnline) {
        return this.http.post(`${this.url}/tienda/nuevo`, tiendaOnline);
    }

    getIndicadores() {
        return this.http.get(`${this.url}/tienda/indicadores`);
    }

    getRecargas() {
        return this.http.get(`${this.url}/tienda/recargas`);
    }

    getRecargasFiltro(fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/recargasFiltro/${fechaInicial}/${fechaFinal}`);
    }

    getRecargasClientes() {
        return this.http.get(`${this.url}/tienda/recargasClientes`);
    }

    getRecargasClientesFiltro(fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/recargasClientesFiltro/${fechaInicial}/${fechaFinal}`);
    }

    getRecargasTotalizado() {
        return this.http.get(`${this.url}/tienda/recargasTotalizado`);
    }

    getRecargasTotalizadoFiltro(fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/recargasTotalizadoFiltro/${fechaInicial}/${fechaFinal}`);
    }

    getDetalleRecarga(persona: string, fecha: string) {
        return this.http.get(`${this.url}/tienda/detalleRecarga/${persona}/${fecha}`);
    }

    getVentasPorPersonaProducto(persona: string, producto: string) {
        return this.http.get(`${this.url}/tienda/ventasPersonaProducto/${btoa(persona)}/${btoa(producto)}`);
    }

    getVentasPorPersonaProductoFiltro(persona: string, producto: string, fechaInicial:string, fechaFinal:string) {
        return this.http.get(`${this.url}/tienda/ventasPersonaProductoFiltro/${btoa(persona)}/${btoa(producto)}/${fechaInicial}/${fechaFinal}`);
    }


    getDetalleVenta(persona: string, producto: string) {
        return this.http.get(`${this.url}/tienda/detalleVenta/${btoa(persona)}/${btoa(producto)}`);
    }

    getDetalleVentaFiltro(persona: string, producto: string,fechaInicial:string,fechaFinal:string) {
        return this.http.get(`${this.url}/tienda/detalleVentaFiltro/${btoa(persona)}/${btoa(producto)}/${fechaInicial}/${fechaFinal}`);
    }

    getVentasProducto() {
        return this.http.get(`${this.url}/tienda/ventasProducto`);
    }

    getVentasProductoFiltro(fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/ventasProductoFiltro/${fechaInicial}/${fechaFinal}`);
    }

    getVentasPersona() {
        return this.http.get(`${this.url}/tienda/ventasPersona`);
    }

    getVentasPersonaFiltro(fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/ventasPersonaFiltro/${fechaInicial}/${fechaFinal}`);
    }

    getComisiones(persona:string) {
        return this.http.get(`${this.url}/tienda/comisionesPorPersona/${btoa(persona)}`);
    }

    getComisionesFiltro(persona:string,fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/comisionesPorPersona/${btoa(persona)}/${fechaInicial}/${fechaFinal}`);
    }


    sendArchivos(data) {
        return this.http.post(`${this.url}/tienda/saveArchivo`, data);
    }

    getArchivosPorRecarga(codtiendaStreaming:string) {
        return this.http.get(`${this.url}/tienda/archivosPorRecarga/${btoa(codtiendaStreaming)}`);
    }

    getArchivosPorRecargaFiltro(codtiendaStreaming:string,fechaInicial: string, fechaFinal: string) {
        return this.http.get(`${this.url}/tienda/archivosPorRecargaFiltro/${btoa(codtiendaStreaming)}/${fechaInicial}/${fechaFinal}`);
    }

    deleteTransaccion(idTransaccion) {
        return this.http.delete(`${this.url}/tienda/deleteArchivo/${idTransaccion}`);
    }

}
