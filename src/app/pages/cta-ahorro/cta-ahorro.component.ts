import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import readXlsxFile from 'read-excel-file';
import { lastValueFrom } from 'rxjs';
import { EXA_Extracto_ahorro, EXA_Indicadores } from 'src/app/models/CtaAhorro';
import { ExtractoAhorroService } from 'src/app/service/extracto-ahorro.service';

@Component({
    selector: 'app-cta-ahorro',
    templateUrl: './cta-ahorro.component.html',
    styleUrls: ['./cta-ahorro.component.scss']
})
export class CtaAhorroComponent implements OnInit {

    //Archivos
    uploadedFiles: any[] = [];

    //Listas
    listExtractos: EXA_Extracto_ahorro[] = [];
    listExtractosDetalle: EXA_Extracto_ahorro[] = [];
    listIngresos: EXA_Extracto_ahorro[] = [];
    listEgresos: EXA_Extracto_ahorro[] = [];
    listSinComisiones: EXA_Extracto_ahorro[] = [];
    listIndicadores: EXA_Indicadores[] = [];
    indicadorSeleccionado: EXA_Indicadores;

    fechaInicial: string = "";
    fechaFinal: string = "";

    //Spiners
    spinIndicadores: boolean = false;
    spinDetalle: boolean = false;
    spinIngresos: boolean = false;
    spinEgresos: boolean = false;
    spinSinComisiones: boolean = false;

    //Vista
    @ViewChild('tableIndicadores') tableIndicadores: Table;
    @ViewChild('tableDetalle') tableDetalle: Table;
    @ViewChild('tableIngresos') tableIngresos: Table;
    @ViewChild('tableEgresos') tableEgresos: Table;
    @ViewChild('tableSinComisiones') tableSinComisiones: Table;


    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    //Filtros
    rangoFechasIndicadores: Date[] = [];
    rangoFechasDetalle: Date[] = [];

    //Totales
    totalValorDetalle: number = 0;
    totalIngresos: number = 0;
    totalEgresos: number = 0;
    totalSinComisiones: number = 0;

    totalSaldoInicialDia: number = 0;
    totalEntradas: number = 0;
    totalSalidas: number = 0;
    totalBalance: number = 0;
    totalSaldoFinaldia: number = 0;

    promedioTotalSaldoInicialDia: number = 0;
    promedioTotalEntradas: number = 0;
    promedioTotalSalidas: number = 0;
    promedioTotalBalance: number = 0;
    promedioTotalSaldoFinaldia: number = 0;



    constructor(private messageService: MessageService, private extractoAhorroService: ExtractoAhorroService) { }

    ngOnInit(): void {
        this.initData();
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

                for (const [index, element2] of rows.entries()) {
                    if (index === 0) {
                        continue;
                    }
                    let extractoObj: EXA_Extracto_ahorro = {
                        fecha: element2[0] + "",
                        hora: element2[1] + "",
                        descripcion: element2[2] + "",
                        servicio: element2[3] + "",
                        saldo_anterior: Number(element2[4]),
                        valor: Number(element2[5]),
                        saldo_final: Number(element2[6]),
                        usuario: element2[7] + "",
                        cliente_responsable: element2[8] + "",
                        cliente_afectado: element2[9] + ""
                    };
                    this.listExtractos.push(extractoObj);
                }
            })
        }
        this.saveAllExtractos();
    }

    async saveAllExtractos() {
        this.showProgressBar = true;
        let dataSubir = this.listExtractos.length;
        let contador = 1;
        for (const elementData of this.listExtractos) {
            await lastValueFrom(this.extractoAhorroService.newExtractoAhorro(elementData)).then((data: any) => { });
            this.valueProgressBar = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de movimientos' });
        this.initData();
        this.showProgressBar = false;

    }

    initData() {
        this.getIndicadores();
    }

    getIndicadores() {
        this.spinIndicadores = true;
        this.listIndicadores = [];
        this.totalSaldoInicialDia = 0;
        this.totalEntradas = 0;
        this.totalSalidas = 0;
        this.totalBalance = 0;
        this.totalSaldoFinaldia = 0;
        this.promedioTotalSaldoInicialDia = 0;
        this.promedioTotalEntradas = 0;
        this.promedioTotalSalidas = 0;
        this.promedioTotalBalance = 0;
        this.promedioTotalSaldoFinaldia = 0;
        this.extractoAhorroService.getIndicadores().subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'No se han encontrado indicadores' });
                return;
            }
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.entradas = Number(element.entradas);
                element.salidas = Number(element.salidas);
                element.saldo_final = Number(element.saldo_final);
                element.diferencia = Number(element.diferencia);
                this.totalSaldoInicialDia += element.saldo_anterior;
                this.totalEntradas += element.entradas;
                this.totalSalidas += element.salidas;
                this.totalBalance += element.diferencia;
                this.totalSaldoFinaldia += element.saldo_final;
            });
            this.promedioTotalSaldoInicialDia = this.totalSaldoInicialDia / this.listIndicadores.length;
            this.promedioTotalEntradas = this.totalEntradas / this.listIndicadores.length;
            this.promedioTotalSalidas = this.totalSalidas / this.listIndicadores.length;
            this.promedioTotalBalance = this.totalBalance / this.listIndicadores.length;
            this.promedioTotalSaldoFinaldia = this.totalSaldoFinaldia / this.listIndicadores.length;
        })
    }

    getIndicadoresPorFecha() {
        let fechaInicial = this.rangoFechasIndicadores[0] != null ? this.formatDate(this.rangoFechasIndicadores[0]) : null;
        let fechaFinal = this.rangoFechasIndicadores[1] != null ? this.formatDate(this.rangoFechasIndicadores[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinIndicadores = true;
        this.listIndicadores = [];
        this.totalSaldoInicialDia = 0;
        this.totalEntradas = 0;
        this.totalSalidas = 0;
        this.totalBalance = 0;
        this.totalSaldoFinaldia = 0;
        this.promedioTotalSaldoInicialDia = 0;
        this.promedioTotalEntradas = 0;
        this.promedioTotalSalidas = 0;
        this.promedioTotalBalance = 0;
        this.promedioTotalSaldoFinaldia = 0;
        this.extractoAhorroService.getIndicadoresPorFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'No se han encontrado indicadores' });
                return;
            }
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.entradas = Number(element.entradas);
                element.salidas = Number(element.salidas);
                element.diferencia = Number(element.diferencia);
                element.saldo_final = Number(element.saldo_final);
                this.totalSaldoInicialDia += element.saldo_anterior;
                this.totalEntradas += element.entradas;
                this.totalSalidas += element.salidas;
                this.totalBalance += element.diferencia;
                this.totalSaldoFinaldia += element.saldo_final;
            });
            this.promedioTotalSaldoInicialDia = this.totalSaldoInicialDia / this.listIndicadores.length;
            this.promedioTotalEntradas = this.totalEntradas / this.listIndicadores.length;
            this.promedioTotalSalidas = this.totalSalidas / this.listIndicadores.length;
            this.promedioTotalBalance = this.totalBalance / this.listIndicadores.length;
            this.promedioTotalSaldoFinaldia = this.totalSaldoFinaldia / this.listIndicadores.length;
        })
    }

    getTotalIngresos(fechaInicial, fechaFinal) {
        this.spinIngresos = true;
        this.totalIngresos = 0;
        this.extractoAhorroService.getIngresos(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinIngresos = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'No se han encontrado ingresos' });
                return;
            }
            this.listIngresos = data.data;
            this.listIngresos.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.valor = Number(element.valor);
                element.saldo_final = Number(element.saldo_final);
                this.totalIngresos += element.valor;
            });
        })
    }

    getTotalEgresos(fechaInicial, fechaFinal) {
        this.spinEgresos = true;
        this.totalEgresos = 0;
        this.extractoAhorroService.getEgresos(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinEgresos = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'No se han encontrado egresos' });
                return;
            }
            this.listEgresos = data.data;
            this.listEgresos.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.valor = Number(element.valor);
                element.saldo_final = Number(element.saldo_final);
                this.totalEgresos += element.valor;
            });
        })
    }

    getTotalSinComision(fechaInicial, fechaFinal) {
        this.spinSinComisiones = true;
        this.totalSinComisiones = 0;
        this.extractoAhorroService.getSinComisiones(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinSinComisiones = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'No se han encontrado egresos' });
                return;
            }
            this.listSinComisiones = data.data;
            this.listSinComisiones.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.valor = Number(element.valor);
                element.saldo_final = Number(element.saldo_final);
                this.totalSinComisiones += element.valor;
            });
        })
    }

    getDetalleCtaAhorro(indiTemp: EXA_Indicadores) {
        if (indiTemp == null) return;
        this.indicadorSeleccionado = indiTemp;
        this.spinDetalle = true;
        this.listExtractosDetalle = [];
        this.extractoAhorroService.getExtractoAhorroPorFecha(indiTemp.fecha, indiTemp.fecha).subscribe((data: any) => {
            this.spinDetalle = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'No se han encontrado información' });
                return;
            }
            this.listExtractosDetalle = data.data;
            this.listExtractosDetalle.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.valor = Number(element.valor);
                element.saldo_final = Number(element.saldo_final);
            });

        })
        this.fechaInicial = indiTemp.fecha;
        this.fechaFinal = indiTemp.fecha;
        this.getTotalIngresos(indiTemp.fecha, indiTemp.fecha);
        this.getTotalEgresos(indiTemp.fecha, indiTemp.fecha);
        this.getTotalSinComision(indiTemp.fecha, indiTemp.fecha);
    }

    filtroTotalizadoDetalle(event, dt) {
        this.totalValorDetalle = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalValorDetalle += Number(element.valor);
        });
    }

    filtroTotalizadoIndicadores(event, dt) {
        this.totalSaldoInicialDia = 0;
        this.totalEntradas = 0;
        this.totalSalidas = 0;
        this.totalBalance = 0;
        this.totalSaldoFinaldia = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalSaldoInicialDia += Number(element.saldo_anterior);
            this.totalEntradas += Number(element.entradas);
            this.totalSalidas += Number(element.salidas);
            this.totalBalance += Number(element.diferencia);
            this.totalSaldoFinaldia += Number(element.saldo_final);
        });
    }

    filtroTotalizadoIngresos(event, dt) {
        this.totalIngresos = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalIngresos += Number(element.valor);
        });
    }

    filtroTotalizadoEgresos(event, dt) {
        this.totalEgresos = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalEgresos += Number(element.valor);
        });
    }

    filtroTotalizadoComisiones(event, dt) {
        this.totalSinComisiones = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalSinComisiones += Number(element.valor);
        });
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

    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableIndicadores:
                this.getIndicadores();
                this.rangoFechasIndicadores = [];
                break;
            case this.tableDetalle:
                this.getDetalleCtaAhorro(this.indicadorSeleccionado);
                this.rangoFechasDetalle = [];
                break;
            case this.tableIngresos:
                this.getTotalIngresos(this.fechaInicial, this.fechaFinal);
                break;
            case this.tableEgresos:
                this.getTotalEgresos(this.fechaInicial, this.fechaFinal);
                break;
            case this.tableSinComisiones:
                this.getTotalSinComision(this.fechaInicial, this.fechaFinal);
                break;
            default:
                break;
        }
    }

}
