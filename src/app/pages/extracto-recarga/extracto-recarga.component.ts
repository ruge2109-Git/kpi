import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import readXlsxFile from 'read-excel-file';
import { lastValueFrom } from 'rxjs';
import { EXR_Extracto_recargas, EXR_Indicadores } from 'src/app/models/Ext_recarga';
import { ExtrctoRecargasService } from 'src/app/service/servicesApp/extrcto-recargas.service';

@Component({
    selector: 'app-extracto-recarga',
    templateUrl: './extracto-recarga.component.html',
    styleUrls: ['./extracto-recarga.component.scss']
})
export class ExtractoRecargaComponent implements OnInit {

    //Archivos
    uploadedFiles: any[] = [];

    //Listas
    listExtractos: EXR_Extracto_recargas[] = [];
    listIndicadores: EXR_Indicadores[] = [];
    listIndicadoresGenerales: EXR_Indicadores[] = [];

    //Fechas
    rangoFechasIndicadores: Date[] = [];
    rangoDetalleCompleto: Date[] = [];
    rangoFechasIndicadoresGenerales: Date[] = [];

    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    //Spinners
    spinInfoCompleta: boolean = false;
    spinIndicador: boolean = false;
    spinIndicadores: boolean = false;

    //Vista
    @ViewChild('tableIndicadores') tableIndicadores: Table;
    @ViewChild('tableInfoCompleta') tableInfoCompleta: Table;
    @ViewChild('tableIndicadoresGenerales') tableIndicadoresGenerales: Table;

    //Totales
    totalValorCompra: number = 0;
    totalValorReparto: number = 0;
    totalValorComisiones: number = 0;

    totalValorCompraGenerales: number = 0;
    totalValorRepartoGenerales: number = 0;
    totalValorComisionesGenerales: number = 0;

    promedioTotalValorCompraGenerales: number = 0;
    promedioTotalValorRepartoGenerales: number = 0;
    promedioTotalValorComisionesGenerales: number = 0;

    totalValorCompleto: number = 0;
    totalSaldoAnteriorCompleto: number = 0;
    totalSaldoFinalCompleto: number = 0;


    constructor(private messageService: MessageService, private extRecarga: ExtrctoRecargasService) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getIndicadores();
        this.getInfoCompleta();
        this.getIndicadoresGenerales();
    }

    async onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        await this.readExcel();
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
    }

    async readExcel() {
        this.listExtractos = [];
        for (const element of this.uploadedFiles) {
            await readXlsxFile(element).then((rows) => {

                for (const [index, element2] of rows.entries()) {
                    if (index === 0) {
                        continue;
                    }
                    let extractoObj: EXR_Extracto_recargas = {
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
            await lastValueFrom(this.extRecarga.newExtractoRecarga(elementData)).then((data: any) => { });
            this.valueProgressBar = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de movimientos' });
        this.initData();
        this.showProgressBar = false;
    }

    getInfoCompleta() {
        this.spinInfoCompleta = true;
        this.listExtractos = [];
        this.totalValorCompleto = 0;
        this.totalSaldoAnteriorCompleto = 0;
        this.totalSaldoFinalCompleto = 0;
        this.extRecarga.getExtractoRecarga().subscribe((data: any) => {
            this.spinInfoCompleta = false;
            if (!data.bRta) return;
            this.listExtractos = data.data;
            this.listExtractos.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.valor = Number(element.valor);
                element.saldo_final = Number(element.saldo_final);
                this.totalValorCompleto += element.valor;
                this.totalSaldoAnteriorCompleto += element.saldo_anterior;
                this.totalSaldoFinalCompleto += element.saldo_final;
            });
        })
    }

    getInfoCompletaFecha() {
        let fechaInicial = this.rangoDetalleCompleto[0] != null ? this.formatDate(this.rangoDetalleCompleto[0]) : null;
        let fechaFinal = this.rangoDetalleCompleto[1] != null ? this.formatDate(this.rangoDetalleCompleto[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinInfoCompleta = true;
        this.listExtractos = [];
        this.totalValorCompleto = 0;
        this.totalSaldoAnteriorCompleto = 0;
        this.totalSaldoFinalCompleto = 0;
        this.extRecarga.getExtractoRecargaPorFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinInfoCompleta = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Información', detail: 'No hay información con el rango de fechas' });
                return;
            };
            this.listExtractos = data.data;
            this.listExtractos.forEach(element => {
                element.saldo_anterior = Number(element.saldo_anterior);
                element.valor = Number(element.valor);
                element.saldo_final = Number(element.saldo_final);
                this.totalValorCompleto += element.valor;
                this.totalSaldoAnteriorCompleto += element.saldo_anterior;
                this.totalSaldoFinalCompleto += element.saldo_final;
            });
        })
    }

    getIndicadores() {
        this.spinIndicador = true;
        this.listIndicadores = [];
        this.extRecarga.getIndicadores().subscribe((data: any) => {
            this.spinIndicador = false;
            if (!data.bRta) return;
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.valor_compra = Number(element.valor_compra);
                element.valor_reparto = Number(element.valor_reparto);
                element.comision = Number(element.comision);
            });
        })
    }

    getIndicadoresPorFecha() {
        let fechaInicial = this.rangoFechasIndicadores[0] != null ? this.formatDate(this.rangoFechasIndicadores[0]) : null;
        let fechaFinal = this.rangoFechasIndicadores[1] != null ? this.formatDate(this.rangoFechasIndicadores[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinIndicador = true;
        this.listIndicadores = [];
        this.extRecarga.getIndicadoresPorFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinIndicador = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Información', detail: 'No hay información con el rango de fechas' });
                return;
            };
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.valor_compra = Number(element.valor_compra);
                element.valor_reparto = Number(element.valor_reparto);
                element.comision = Number(element.comision);
            });
        })
    }

    getIndicadoresGenerales() {
        this.spinIndicadores = true;
        this.totalValorCompraGenerales = 0;
        this.totalValorRepartoGenerales = 0;
        this.totalValorComisionesGenerales = 0;
        this.promedioTotalValorCompraGenerales = 0;
        this.promedioTotalValorRepartoGenerales = 0;
        this.promedioTotalValorComisionesGenerales = 0;
        this.listIndicadoresGenerales = [];
        this.extRecarga.getIndicadoresGenerales().subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) return;
            this.listIndicadoresGenerales = data.data;
            this.listIndicadoresGenerales.forEach(element => {
                element.valor_compra = Number(element.valor_compra);
                element.valor_reparto = Number(element.valor_reparto);
                element.comision = Number(element.comision);
                this.totalValorCompraGenerales += element.valor_compra;
                this.totalValorRepartoGenerales += element.valor_reparto;
                this.totalValorComisionesGenerales += element.comision;
            });
            this.promedioTotalValorCompraGenerales = this.totalValorCompraGenerales / this.listIndicadoresGenerales.length;
            this.promedioTotalValorRepartoGenerales = this.totalValorRepartoGenerales / this.listIndicadoresGenerales.length;
            this.promedioTotalValorComisionesGenerales = this.totalValorComisionesGenerales / this.listIndicadoresGenerales.length;

        })
    }

    getIndicadoresGeneralesPorFecha() {
        let fechaInicial = this.rangoFechasIndicadoresGenerales[0] != null ? this.formatDate(this.rangoFechasIndicadoresGenerales[0]) : null;
        let fechaFinal = this.rangoFechasIndicadoresGenerales[1] != null ? this.formatDate(this.rangoFechasIndicadoresGenerales[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinIndicadores = true;
        this.listIndicadoresGenerales = [];
        this.totalValorCompraGenerales = 0;
        this.totalValorRepartoGenerales = 0;
        this.totalValorComisionesGenerales = 0;
        this.promedioTotalValorCompraGenerales = 0;
        this.promedioTotalValorRepartoGenerales = 0;
        this.promedioTotalValorComisionesGenerales = 0;
        this.extRecarga.getIndicadoresGeneralesFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Información', detail: 'No hay información con el rango de fechas' });
                return;
            };
            this.listIndicadoresGenerales = data.data;
            this.listIndicadoresGenerales.forEach(element => {
                element.valor_compra = Number(element.valor_compra);
                element.valor_reparto = Number(element.valor_reparto);
                element.comision = Number(element.comision);
                this.totalValorCompraGenerales += element.valor_compra;
                this.totalValorRepartoGenerales += element.valor_reparto;
                this.totalValorComisionesGenerales += element.comision;
            });
            this.promedioTotalValorCompraGenerales = this.totalValorCompraGenerales / this.listIndicadoresGenerales.length;
            this.promedioTotalValorRepartoGenerales = this.totalValorRepartoGenerales / this.listIndicadoresGenerales.length;
            this.promedioTotalValorComisionesGenerales = this.totalValorComisionesGenerales / this.listIndicadoresGenerales.length;
        })
    }

    filtroTotalizadoIndicadores(event, dt) {
        this.totalValorCompra = 0;
        this.totalValorReparto = 0;
        this.totalValorComisiones = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalValorCompra += Number(element.valor_compra);
            this.totalValorReparto += Number(element.valor_reparto);
            this.totalValorComisiones += Number(element.comision);
        });
    }

    filtroTotalizadoIndicadoresGenerales(event, dt) {
        this.totalValorCompraGenerales = 0;
        this.totalValorRepartoGenerales = 0;
        this.totalValorComisionesGenerales = 0;
        this.promedioTotalValorCompraGenerales = 0;
        this.promedioTotalValorRepartoGenerales = 0;
        this.promedioTotalValorComisionesGenerales = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalValorCompraGenerales += Number(element.valor_compra);
            this.totalValorRepartoGenerales += Number(element.valor_reparto);
            this.totalValorComisionesGenerales += Number(element.comision);
        });
        this.promedioTotalValorCompraGenerales = this.totalValorCompraGenerales / dataFiltrada.length;
        this.promedioTotalValorRepartoGenerales = this.totalValorRepartoGenerales / dataFiltrada.length;
        this.promedioTotalValorComisionesGenerales = this.totalValorComisionesGenerales / dataFiltrada.length;
    }

    filtroTotalizadoCompleto(event, dt) {
        this.totalValorCompleto = 0;
        this.totalSaldoAnteriorCompleto = 0;
        this.totalSaldoFinalCompleto = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalValorCompleto += element.valor;
            this.totalSaldoAnteriorCompleto += element.saldo_anterior;
            this.totalSaldoFinalCompleto += element.saldo_final;
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
            case this.tableInfoCompleta:
                this.getInfoCompleta();
                this.rangoDetalleCompleto = [];
                break;
            case this.tableIndicadoresGenerales:
                this.getIndicadoresGenerales();
                this.rangoFechasIndicadoresGenerales = [];
                break;
            default:
                break;
        }
    }

}
