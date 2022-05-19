import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sales_report } from '../models/recargas';

@Injectable({
    providedIn: 'root'
})
export class RecargasService {

    private url = environment.urlTiendaOnline;

    constructor(private http: HttpClient) { }

    getSalesReporte() {
        return this.http.get(`${this.url}/sales_report`);
    }

    newSalesReporte(sales_report: Sales_report) {
        return this.http.post(`${this.url}/sales_report/nuevo`, sales_report);
    }

    //Reportes

    getIndicadores() {
        return this.http.get(`${this.url}/sales_report/indicadores`);
    }

    getIndicadoresFecha(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/indicadoresFecha/${fechaIni}/${fechaFin}`);
    }

    getClienteCanal() {
        return this.http.get(`${this.url}/sales_report/clientesCanal`);
    }

    getClienteOperador() {
        return this.http.get(`${this.url}/sales_report/clientesOperador`);
    }

    getClienteCanalFiltroFecha(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/clientesCanal/fechaFiltro/${fechaIni}/${fechaFin}`);
    }

    getClienteOperadorFiltroFecha(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/clientesOperador/fechaFiltro/${fechaIni}/${fechaFin}`);
    }

    getDetalleRecargaPorCliente(cliente:string) {
        return this.http.get(`${this.url}/sales_report/detalleCliente/${btoa(cliente)}`);
    }

    getDetalleRecargaPorCanal(cliente:string) {
        return this.http.get(`${this.url}/sales_report/detalleCanal/${btoa(cliente)}`);
    }

    getDetalleRecargaPorOperador(cliente:string) {
        return this.http.get(`${this.url}/sales_report/detalleOperador/${btoa(cliente)}`);
    }

    getDetalleRecargaPorClienteFechas(cliente:string,fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/detalleCliente/${btoa(cliente)}/${fechaIni}/${fechaFin}`);
    }

    getTopCanal() {
        return this.http.get(`${this.url}/sales_report/topCanal`);
    }

    getTopCanalFechas(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/topCanalFechas/${fechaIni}/${fechaFin}`);
    }

    getTopOperador() {
        return this.http.get(`${this.url}/sales_report/topOperador`);
    }

    getTopOperadorFechas(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/topOperadorFechas/${fechaIni}/${fechaFin}`);
    }

    getTopCliente() {
        return this.http.get(`${this.url}/sales_report/topCliente`);
    }

    getTopClienteFechas(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/topClienteFechas/${fechaIni}/${fechaFin}`);
    }

    getTopComisiones() {
        return this.http.get(`${this.url}/sales_report/topComision`);
    }

    getTopComisionesFechas(fechaIni:string,fechaFin:string) {
        return this.http.get(`${this.url}/sales_report/topComisionFechas/${fechaIni}/${fechaFin}`);
    }

}
