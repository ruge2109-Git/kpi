import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import readXlsxFile, { Row } from 'read-excel-file';
import { Cell } from 'read-excel-file/types';
import { lastValueFrom } from 'rxjs';
import { MIEn_Indicadores, MiEn_Movimientos } from 'src/app/models/MiEntretenimiento';
import { MiEntretenimientoService } from 'src/app/service/mi-entretenimiento.service';

@Component({
    selector: 'app-mi-entretenimiento',
    templateUrl: './mi-entretenimiento.component.html',
    styleUrls: ['./mi-entretenimiento.component.scss']
})
export class MiEntretenimientoComponent implements OnInit {

    //Archivos
    uploadedFiles: any[] = [];

    //Listas
    listData: MiEn_Movimientos[] = [];
    listNewMovimientos: MiEn_Movimientos[] = [];

    listVentas: MiEn_Movimientos[] = [];
    listCambioCuenta: MiEn_Movimientos[] = [];
    listComisionPorVenta: MiEn_Movimientos[] = [];
    listCompraSaldo: MiEn_Movimientos[] = [];
    listComisionPorRenovacion: MiEn_Movimientos[] = [];
    listRenovacion: MiEn_Movimientos[] = [];
    listDevolucionRenovacion: MiEn_Movimientos[] = [];
    listRecepcionSaldo: MiEn_Movimientos[] = [];
    listIndicadores: MIEn_Indicadores[] = [];

    //Spinners
    spinVentas: boolean = false;
    spinCambioCuenta: boolean = false;
    spinComisionPorVenta: boolean = false;
    spinCompraSaldo: boolean = false;
    spinComisionPorRenovacion: boolean = false;
    spinRenovacion: boolean = false;
    spinDevolucionRenovacion: boolean = false;
    spinRecepcionSaldo: boolean = false;
    spinIndicadores: boolean = false;

    //Totales
    totalVentas: number = 0;
    totalCambioCuenta: number = 0;
    totalComisionPorVenta: number = 0;
    totalCompraSaldo: number = 0;
    totalComisionPorRenovacion: number = 0;
    totalRenovacion: number = 0;
    totalDevolucionRenovacion: number = 0;
    totalRecepcionSaldo: number = 0;

    totalIndicadoresVentas: number = 0;
    totalIndicadorescambio_cuenta: number = 0;
    totalIndicadorescomision_venta: number = 0;
    totalIndicadorescompra_saldo: number = 0;
    totalIndicadorescomision_renovacion: number = 0;
    totalIndicadoresrenovacion: number = 0;
    totalIndicadoresdevolucion_renovacion: number = 0;
    totalIndicadoresrecepcion_saldo: number = 0;

    totalPromedioVentas: number = 0;
    totalPromedioCambioCuenta: number = 0;
    totalPromedioComisionPorVenta: number = 0;
    totalPromedioCompraSaldo: number = 0;
    totalPromedioComisionPorRenovacion: number = 0;
    totalPromedioRenovacion: number = 0;
    totalPromedioDevolucionRenovacion: number = 0;
    totalPromedioRecepcionSaldo: number = 0;
    totalPromedioIndicadores: number = 0;


    totalPromedioIndicadoresVentas: number = 0;
    totalPromedioIndicadorescambio_cuenta: number = 0;
    totalPromedioIndicadorescomision_venta: number = 0;
    totalPromedioIndicadorescompra_saldo: number = 0;
    totalPromedioIndicadorescomision_renovacion: number = 0;
    totalPromedioIndicadoresrenovacion: number = 0;
    totalPromedioIndicadoresdevolucion_renovacion: number = 0;
    totalPromedioIndicadoresrecepcion_saldo: number = 0;

    //Rango fechas
    rangoFechasVentas: Date[] = [];
    rangoCambioCuenta: Date[] = [];
    rangoComisionPorVenta: Date[] = [];
    rangoCompraSaldo: Date[] = [];
    rangoComisionPorRenovacion: Date[] = [];
    rangoRenovacion: Date[] = [];
    rangoDevolucionRenovacion: Date[] = [];
    rangoRecepcionSaldo: Date[] = [];
    rangoIndicadores: Date[] = [];

    //Tablas
    @ViewChild('tableVentas') tableVentas: Table;
    @ViewChild('tableCambioCuenta') tableCambioCuenta: Table;
    @ViewChild('tableComisionVenta') tableComisionVenta: Table;
    @ViewChild('tableCompraSaldo') tableCompraSaldo: Table;
    @ViewChild('tableComisionRenovacion') tableComisionRenovacion: Table;
    @ViewChild('tableRenovacion') tableRenovacion: Table;
    @ViewChild('tableDevolucionRenovacion') tableDevolucionRenovacion: Table;
    @ViewChild('tableRecepcionSaldo') tableRecepcionSaldo: Table;
    @ViewChild('tableIndicadores') tableIndicadores: Table;


    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    constructor(private messageService: MessageService, private miEntretenimientoService: MiEntretenimientoService) { }

    ngOnInit(): void {
        this.initData()
    }

    //Get information
    initData() {
        this.listData = [];
        this.miEntretenimientoService.getData().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listData = data.data;
            this.getVentas();
            this.getCambioCuenta();
            this.getComisionVenta();
            this.getCompraSaldo();
            this.getComisionRenovacion();
            this.getRenovacion();
            this.getDevolucionRenovacion();
            this.getRecepcionSaldo();
            this.getIndicadores();
        })
    }

    getIndicadores() {
        this.spinIndicadores = true;
        this.totalIndicadoresVentas = 0;
        this.totalIndicadorescambio_cuenta = 0;
        this.totalIndicadorescomision_venta = 0;
        this.totalIndicadorescompra_saldo = 0;
        this.totalIndicadorescomision_renovacion = 0;
        this.totalIndicadoresrenovacion = 0;
        this.totalIndicadoresdevolucion_renovacion = 0;
        this.totalIndicadoresrecepcion_saldo = 0;

        this.totalPromedioIndicadoresVentas = 0;
        this.totalPromedioIndicadorescambio_cuenta = 0;
        this.totalPromedioIndicadorescomision_venta = 0;
        this.totalPromedioIndicadorescompra_saldo = 0;
        this.totalPromedioIndicadorescomision_renovacion = 0;
        this.totalPromedioIndicadoresrenovacion = 0;
        this.totalPromedioIndicadoresdevolucion_renovacion = 0;
        this.totalPromedioIndicadoresrecepcion_saldo = 0;

        this.listIndicadores = [];
        this.miEntretenimientoService.getIndicadores().subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) return;
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.ventas = Number(element.ventas);
                element.cambio_cuenta = Number(element.cambio_cuenta);
                element.comision_venta = Number(element.comision_venta);
                element.compra_saldo = Number(element.compra_saldo);
                element.comision_renovacion = Number(element.comision_renovacion);
                element.renovacion = Number(element.renovacion);
                element.devolucion_renovacion = Number(element.devolucion_renovacion);
                element.recepcion_saldo = Number(element.recepcion_saldo);

                this.totalIndicadoresVentas = element.ventas;
                this.totalIndicadorescambio_cuenta = element.cambio_cuenta;
                this.totalIndicadorescomision_venta = element.comision_venta;
                this.totalIndicadorescompra_saldo = element.compra_saldo;
                this.totalIndicadorescomision_renovacion = element.comision_renovacion;
                this.totalIndicadoresrenovacion = element.renovacion;
                this.totalIndicadoresdevolucion_renovacion = element.devolucion_renovacion;
                this.totalIndicadoresrecepcion_saldo = element.recepcion_saldo;


            });
        })
    }

    getIndicadoresFecha() {

        let fechaInicial = this.rangoIndicadores[0] != null ? this.formatDate(this.rangoIndicadores[0]) : null;
        let fechaFinal = this.rangoIndicadores[1] != null ? this.formatDate(this.rangoIndicadores[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;

        this.spinIndicadores = true;
        this.totalIndicadoresVentas = 0;
        this.totalIndicadorescambio_cuenta = 0;
        this.totalIndicadorescomision_venta = 0;
        this.totalIndicadorescompra_saldo = 0;
        this.totalIndicadorescomision_renovacion = 0;
        this.totalIndicadoresrenovacion = 0;
        this.totalIndicadoresdevolucion_renovacion = 0;
        this.totalIndicadoresrecepcion_saldo = 0;

        this.totalPromedioIndicadoresVentas = 0;
        this.totalPromedioIndicadorescambio_cuenta = 0;
        this.totalPromedioIndicadorescomision_venta = 0;
        this.totalPromedioIndicadorescompra_saldo = 0;
        this.totalPromedioIndicadorescomision_renovacion = 0;
        this.totalPromedioIndicadoresrenovacion = 0;
        this.totalPromedioIndicadoresdevolucion_renovacion = 0;
        this.totalPromedioIndicadoresrecepcion_saldo = 0;

        this.listIndicadores = [];
        this.miEntretenimientoService.getIndicadoresFecha(fechaInicial,fechaFinal).subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) return;
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.ventas = Number(element.ventas);
                element.cambio_cuenta = Number(element.cambio_cuenta);
                element.comision_venta = Number(element.comision_venta);
                element.compra_saldo = Number(element.compra_saldo);
                element.comision_renovacion = Number(element.comision_renovacion);
                element.renovacion = Number(element.renovacion);
                element.devolucion_renovacion = Number(element.devolucion_renovacion);
                element.recepcion_saldo = Number(element.recepcion_saldo);

                this.totalIndicadoresVentas = element.ventas;
                this.totalIndicadorescambio_cuenta = element.cambio_cuenta;
                this.totalIndicadorescomision_venta = element.comision_venta;
                this.totalIndicadorescompra_saldo = element.compra_saldo;
                this.totalIndicadorescomision_renovacion = element.comision_renovacion;
                this.totalIndicadoresrenovacion = element.renovacion;
                this.totalIndicadoresdevolucion_renovacion = element.devolucion_renovacion;
                this.totalIndicadoresrecepcion_saldo = element.recepcion_saldo;


            });
        })
    }

    getVentas() {
        this.spinVentas = true;
        this.totalVentas = 0;
        this.totalPromedioVentas = 0;
        this.listVentas = [];
        this.listVentas = this.listData.filter((data) => data.movimiento == 'Venta');
        this.spinVentas = false;
    }

    getVentasFecha() {
        let startDate = this.rangoFechasVentas[0] != null ? this.rangoFechasVentas[0] : null;
        let endDate = this.rangoFechasVentas[1] != null ? this.rangoFechasVentas[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listVentas = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Venta') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    getCambioCuenta() {
        this.spinCambioCuenta = true;
        this.totalCambioCuenta = 0;
        this.listCambioCuenta = [];
        this.listCambioCuenta = this.listData.filter((data) => data.movimiento == 'Cambio cuenta');
        this.spinCambioCuenta = false;
    }

    getCambioCuentaFecha() {
        let startDate = this.rangoCambioCuenta[0] != null ? this.rangoCambioCuenta[0] : null;
        let endDate = this.rangoCambioCuenta[1] != null ? this.rangoCambioCuenta[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listCambioCuenta = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Cambio cuenta') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }


    getComisionVenta() {
        this.spinComisionPorVenta = true;
        this.totalComisionPorVenta = 0;
        this.listComisionPorVenta = [];
        this.listComisionPorVenta = this.listData.filter((data) => data.movimiento == 'Comisión por venta');
        this.spinComisionPorVenta = false;
    }

    getComisionVentaFecha() {
        let startDate = this.rangoComisionPorVenta[0] != null ? this.rangoComisionPorVenta[0] : null;
        let endDate = this.rangoComisionPorVenta[1] != null ? this.rangoComisionPorVenta[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listComisionPorVenta = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Comisión por venta') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    getCompraSaldo() {
        this.spinCompraSaldo = true;
        this.totalCompraSaldo = 0;
        this.listCompraSaldo = [];
        this.listCompraSaldo = this.listData.filter((data) => data.movimiento == 'Compra de saldo');
        this.spinCompraSaldo = false;
    }

    getCompraSaldoFecha() {
        let startDate = this.rangoCompraSaldo[0] != null ? this.rangoCompraSaldo[0] : null;
        let endDate = this.rangoCompraSaldo[1] != null ? this.rangoCompraSaldo[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listCompraSaldo = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Compra de saldo') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    getComisionRenovacion() {
        this.spinComisionPorVenta = true;
        this.totalComisionPorRenovacion = 0;
        this.listComisionPorRenovacion = [];
        this.listComisionPorRenovacion = this.listData.filter((data) => data.movimiento == 'Comisión por renovación');
        this.spinComisionPorVenta = false;
    }

    getComisionRenovacionFecha() {
        let startDate = this.rangoComisionPorRenovacion[0] != null ? this.rangoComisionPorRenovacion[0] : null;
        let endDate = this.rangoComisionPorRenovacion[1] != null ? this.rangoComisionPorRenovacion[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listComisionPorRenovacion = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Comisión por renovación') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    getRenovacion() {
        this.spinRenovacion = true;
        this.totalRenovacion = 0;
        this.listRenovacion = [];
        this.listRenovacion = this.listData.filter((data) => data.movimiento == 'Renovación');
        this.spinRenovacion = false;
    }

    getRenovacionFecha() {
        let startDate = this.rangoRenovacion[0] != null ? this.rangoRenovacion[0] : null;
        let endDate = this.rangoRenovacion[1] != null ? this.rangoRenovacion[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listRenovacion = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Renovación') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    getDevolucionRenovacion() {
        this.spinDevolucionRenovacion = true;
        this.totalDevolucionRenovacion = 0;
        this.listDevolucionRenovacion = [];
        this.listDevolucionRenovacion = this.listData.filter((data) => data.movimiento == 'Devolución renovación');
        this.spinDevolucionRenovacion = false;
    }

    getDevolucionRenovacionFecha() {

        let startDate = this.rangoDevolucionRenovacion[0] != null ? this.rangoDevolucionRenovacion[0] : null;
        let endDate = this.rangoDevolucionRenovacion[1] != null ? this.rangoDevolucionRenovacion[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listDevolucionRenovacion = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Devolución renovación') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    getRecepcionSaldo() {
        this.spinRecepcionSaldo = true;
        this.totalRecepcionSaldo = 0;
        this.listRecepcionSaldo = [];
        this.listRecepcionSaldo = this.listData.filter((data) => data.movimiento == 'Recepción de saldo');
        this.spinRecepcionSaldo = false;
    }

    getRecepcionSaldoFecha() {

        let startDate = this.rangoRecepcionSaldo[0] != null ? this.rangoRecepcionSaldo[0] : null;
        let endDate = this.rangoRecepcionSaldo[1] != null ? this.rangoRecepcionSaldo[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listRecepcionSaldo = this.listData.filter((element) => {

            let currentDate = new Date(element.fecha);
            if ((element.movimiento == 'Recepción de saldo') && (currentDate >= startDate && currentDate <= endDate)) {
                return true;
            }
            return false;
        });

    }

    async onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        await this.readExcel();
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
    }

    async readExcel() {
        for (const element of this.uploadedFiles) {
            await readXlsxFile(element).then((rows) => {
                for (const element2 of rows) {
                    if (element2[0] == 'Datos exportados' || element2[0] == 'ID') continue;
                    let data: MiEn_Movimientos = {
                        id: element2[0] + "",
                        movimiento: this.obtenerMovimiento(element2[1] + ""),
                        producto: this.obtenerProducto(element2[1] + ""),
                        descripcion: this.obtenerDescripcion(element2[1] + ""),
                        valor: this.obtenerValor(element2[5]),
                        saldo_anterior: this.obtenerValor(element2[6]),
                        nuevo_saldo: this.obtenerValor(element2[7]),
                        fecha: this.parsearFecha(element2[8] + ""),
                        tipo: element2[9] + ""
                    }
                    this.listNewMovimientos.push(data);
                }
            })
        }
        this.saveMovimientos();
        this.initData();
    }

    //Guardar información
    async saveMovimientos() {
        this.showProgressBar = true;
        let dataSubir = this.listNewMovimientos.length;
        let contador = 1;

        for (const movimiento of this.listNewMovimientos) {

            await lastValueFrom(this.miEntretenimientoService.newMovimiento(movimiento)).then((data: any) => { });
            this.valueProgressBar = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de movimientos' });
        this.showProgressBar = false;
    }

    //Desglosar información
    obtenerMovimiento(descripcionDB: string) {
        if (descripcionDB.includes('CAMBIO CUENTA')) {
            return 'Cambio cuenta';
        }
        if (descripcionDB.includes('comisión por renovación')) {
            return 'Comisión por renovación';
        }
        if (descripcionDB.includes('comisión por venta')) {
            return 'Comisión por venta';
        }
        if (descripcionDB.includes('Compra de saldo')) {
            return 'Compra de saldo';
        }
        if (descripcionDB.includes('DEVOLUCIÓN RENOVACIÓN')) {
            return 'Devolución renovación';
        }
        if (descripcionDB.includes('Recepción de saldo')) {
            return 'Recepción de saldo';
        }
        if (descripcionDB.split(" ")[0].includes('RENOVACIÓN')) {
            return 'Renovación';
        }
        if (descripcionDB.includes('VENTA')) {
            return 'Venta';
        }
        return "";
    }

    obtenerProducto(descripcionDB: string) {

        if (descripcionDB.includes('comisión por venta')) {
            return descripcionDB.split('comisión por venta ')[1].split(" ")[0].trim();;
        }
        if (descripcionDB.includes('comisión por renovación')) {
            return descripcionDB.split('comisión por renovación ')[1].split(" ")[0].trim();;
        }
        if (descripcionDB.includes('DEVOLUCIÓN RENOVACIÓN')) {
            return descripcionDB.split('DEVOLUCIÓN RENOVACIÓN ')[1].split(":")[0].trim();;
        }
        if (descripcionDB.split(" ")[0].includes('RENOVACIÓN')) {
            return descripcionDB.split('RENOVACIÓN ')[1].split(":")[0].trim();;
        }
        if (descripcionDB.includes('VENTA')) {
            return descripcionDB.split('VENTA ')[1].split(":")[0].trim();;
        }
        return "";
    }

    obtenerDescripcion(descripcionDB: string) {

        if (descripcionDB.includes('CAMBIO CUENTA datos: ')) {
            return descripcionDB.split('CAMBIO CUENTA datos: ')[1].trim();;
        }
        if (descripcionDB.includes('Compra de saldo ')) {
            return descripcionDB.split('Compra de saldo ')[1].trim();;
        }
        if (descripcionDB.includes('Recepción de saldo del ')) {
            return descripcionDB.split('Recepción de saldo del ')[1].trim();;
        }
        if (descripcionDB.includes('DEVOLUCIÓN RENOVACIÓN')) {
            return descripcionDB.split('DEVOLUCIÓN RENOVACIÓN ')[1].split(":")[1].trim();;
        }
        if (descripcionDB.split(" ")[0].includes('RENOVACIÓN')) {
            return descripcionDB.split('RENOVACIÓN ')[1].split(":")[1].trim();;
        }
        if (descripcionDB.includes('Recepción de saldo')) {
            return descripcionDB.split('Recepción de saldo del')[1].trim();;
        }
        if (descripcionDB.includes('VENTA')) {
            return descripcionDB.split('VENTA ')[1].split(": [ ]")[1].trim();;
        }
        return "";
    }

    obtenerValor(valor: Cell) {
        valor = valor.toString().replace(/\$|\,/g, '');
        valor = valor.toString().replace('no registra', '0');
        return Number(valor);
    }

    parsearFecha(fecha: string) {
        let fechaHora = fecha.split(' ');
        let datosFecha = fechaHora[0].split('/');
        return `${datosFecha[2]}-${datosFecha[1]}-${datosFecha[0]} ${fechaHora[1]}`;
    }

    //Filtros
    filtroVentas(event, table) {
        this.totalVentas = 0;
        this.totalPromedioVentas = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalVentas += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioVentas = this.totalVentas / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroComisionVentas(event, table) {
        this.totalComisionPorVenta = 0;
        this.totalPromedioComisionPorVenta = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalComisionPorVenta += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioComisionPorVenta = this.totalComisionPorVenta / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroCompraSaldo(event, table) {
        this.totalCompraSaldo = 0;
        this.totalPromedioCompraSaldo = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalCompraSaldo += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioCompraSaldo = this.totalCompraSaldo / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroComisionRenovacion(event, table) {
        this.totalComisionPorRenovacion = 0;
        this.totalPromedioComisionPorRenovacion = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalComisionPorRenovacion += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioComisionPorRenovacion = this.totalComisionPorRenovacion / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroRenovacion(event, table) {
        this.totalRenovacion = 0;
        this.totalPromedioRenovacion = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalRenovacion += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioRenovacion = this.totalRenovacion / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroDevolucionRenovacion(event, table) {
        this.totalDevolucionRenovacion = 0;
        this.totalPromedioDevolucionRenovacion = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalDevolucionRenovacion += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioDevolucionRenovacion = this.totalDevolucionRenovacion / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroRecepcionSaldo(event, table) {
        this.totalRecepcionSaldo = 0;
        this.totalPromedioRecepcionSaldo = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalRecepcionSaldo += Number(element.valor);
            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioRecepcionSaldo = this.totalRecepcionSaldo / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    filtroIndicadores(event, table) {
        this.totalIndicadoresVentas = 0;
        this.totalIndicadorescambio_cuenta = 0;
        this.totalIndicadorescomision_venta = 0;
        this.totalIndicadorescompra_saldo = 0;
        this.totalIndicadorescomision_renovacion = 0;
        this.totalIndicadoresrenovacion = 0;
        this.totalIndicadoresdevolucion_renovacion = 0;
        this.totalIndicadoresrecepcion_saldo = 0;

        this.totalPromedioIndicadoresVentas = 0;
        this.totalPromedioIndicadorescambio_cuenta = 0;
        this.totalPromedioIndicadorescomision_venta = 0;
        this.totalPromedioIndicadorescompra_saldo = 0;
        this.totalPromedioIndicadorescomision_renovacion = 0;
        this.totalPromedioIndicadoresrenovacion = 0;
        this.totalPromedioIndicadoresdevolucion_renovacion = 0;
        this.totalPromedioIndicadoresrecepcion_saldo = 0;

        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.totalIndicadoresVentas += Number(element.ventas);
            this.totalIndicadorescambio_cuenta += Number(element.cambio_cuenta);
            this.totalIndicadorescomision_venta += Number(element.comision_venta);
            this.totalIndicadorescompra_saldo += Number(element.compra_saldo);
            this.totalIndicadorescomision_renovacion += Number(element.comision_renovacion);
            this.totalIndicadoresrenovacion += Number(element.renovacion);
            this.totalIndicadoresdevolucion_renovacion += Number(element.devolucion_renovacion);
            this.totalIndicadoresrecepcion_saldo += Number(element.recepcion_saldo);

            if (!listaFechas.includes(element.fecha.toString().split(" ")[0])) {
                listaFechas.push(element.fecha.toString().split(" ")[0]);
            }
        });
        this.totalPromedioIndicadoresVentas = this.totalIndicadoresVentas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadorescambio_cuenta = this.totalIndicadorescambio_cuenta / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadorescomision_venta = this.totalIndicadorescomision_venta / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadorescompra_saldo = this.totalIndicadorescompra_saldo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadorescomision_renovacion = this.totalIndicadorescomision_renovacion / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadoresrenovacion = this.totalIndicadoresrenovacion / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadoresdevolucion_renovacion = this.totalIndicadoresdevolucion_renovacion / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.totalPromedioIndicadoresrecepcion_saldo = this.totalIndicadoresrecepcion_saldo / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableVentas:
                this.getVentas();
                this.rangoFechasVentas = [];
                break;
            case this.tableCambioCuenta:
                this.getCambioCuenta();
                this.rangoCambioCuenta = [];
                break;
            case this.tableComisionVenta:
                this.getComisionVenta();
                this.rangoComisionPorVenta = [];
                break;
            case this.tableCompraSaldo:
                this.getCompraSaldo();
                this.rangoCompraSaldo = [];
                break;
            case this.tableComisionRenovacion:
                this.getComisionRenovacion();
                this.rangoComisionPorRenovacion = [];
                break;
            case this.tableRenovacion:
                this.getRenovacion();
                this.rangoRenovacion = [];
                break;
            case this.tableDevolucionRenovacion:
                this.getDevolucionRenovacion();
                this.rangoDevolucionRenovacion = [];
                break;
            case this.tableRecepcionSaldo:
                this.getRecepcionSaldo();
                this.rangoRecepcionSaldo = [];
                break;
            case this.tableIndicadores:
                this.getIndicadores();
                this.rangoIndicadores = [];
                break;

            default:
                break;
        }
    }

    formatDate(date: Date) {
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate())
        ].join('-');
    }

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }


}
