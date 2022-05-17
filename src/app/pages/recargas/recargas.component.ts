import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import readXlsxFile from 'read-excel-file';
import { lastValueFrom } from 'rxjs';
import { Sales_report, SR_Cliente_Canal, SR_Cliente_Operador, SR_top_canal, SR_top_cliente, SR_top_operador } from 'src/app/models/recargas';
import { RecargasService } from 'src/app/service/recargas.service';

@Component({
    selector: 'app-recargas',
    templateUrl: './recargas.component.html',
    styleUrls: ['./recargas.component.scss']
})
export class RecargasComponent implements OnInit {

    //Archivos
    uploadedFiles: any[] = [];

    //Listas
    public listRecargas: Sales_report[] = [];
    public listRecargasClienteCanal: SR_Cliente_Canal[] = [];
    public listRecargasClienteOperador: SR_Cliente_Operador[] = [];
    public listRecargasCliente: Sales_report[] = [];
    public listTopCanal: SR_top_canal[] = [];
    public listTopOperador: SR_top_operador[] = [];
    public listTopCliente: SR_top_cliente[] = [];
    public listTopComision: Sales_report[] = [];

    public recargaSeleccionada: Sales_report;
    public canalSeleccionado: SR_top_canal;
    public operadorSeleccionado: SR_top_operador;
    public tipoDetalle: string;

    //Spiners
    spinRecargas: boolean = false;
    spinRecargasClienteCanal: boolean = false;
    spinRecargasClienteOperador: boolean = false;
    spinRecargasCliente: boolean = false;
    spinTopCanal: boolean = false;
    spinTopOperador: boolean = false;
    spinTopCliente: boolean = false;
    spinTopComision: boolean = false;

    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    //Filtros
    rangoFechasClientesCanal: Date[] = [];
    rangoFechasClientesOperador: Date[] = [];
    rangoFechasClientesRecargas: Date[] = [];
    rangoFechasTopCanal: Date[] = [];
    rangoFechasTopOperador: Date[] = [];
    rangoFechasTopCliente: Date[] = [];
    rangoFechasTopComisiones: Date[] = [];

    //Vista
    @ViewChild('tableClientesCanal') tableClientesCanal: Table;
    @ViewChild('tableClientesOperador') tableClientesOperador: Table;
    @ViewChild('tableRecargasCliente') tableRecargasCliente: Table;
    @ViewChild('tableTopCanal') tableTopCanal: Table;
    @ViewChild('tableTopOperador') tableTopOperador: Table;
    @ViewChild('tableTopCliente') tableTopCliente: Table;
    @ViewChild('tableTopComision') tableTopComision: Table;

    //Totalizado
    totalCantidadClientesCanal: number = 0;
    totalValorClientesCanal: number = 0;
    totalCantidadClientesOperador: number = 0;
    totalValorClientesOperador: number = 0;
    totalVentasClientesRecargas: number = 0;
    totalVentasTopCanal: number = 0;
    totalCantidadTopCanal: number = 0;
    totalVentasTopOperador: number = 0;
    totalCantidadTopOperador: number = 0;
    totalVentasTopCliente: number = 0;
    totalCantidadTopCliente: number = 0;



    constructor(private messageService: MessageService, private salesReportService: RecargasService) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getSalesReport();
        this.getClientesCanal();
        this.getClientesOperador();
        this.getTopCanal();
        this.getTopOperador();
        this.getTopCliente();
        this.getTopComisiones();
    }

    getSalesReport() {
        this.salesReportService.getSalesReporte().subscribe((data: any) => {
            this.spinRecargas = false;
            if (!data.bRta) return;
            this.listRecargas = data.data;
            // this.listRecargas.forEach(element => {
            //     element.valor_recarga = Number(element.valor_recarga);
            //     this.totalRecargasRealizadas += Number(element.valor_recarga);
            // });
        })
    }

    getClientesCanal() {
        this.totalCantidadClientesCanal = 0;
        this.totalValorClientesCanal = 0;
        this.spinRecargasClienteCanal = true;
        this.salesReportService.getClienteCanal().subscribe((data: any) => {
            this.spinRecargasClienteCanal = false;
            if (!data.bRta) return;
            this.listRecargasClienteCanal = data.data;
            this.listRecargasClienteCanal.forEach(element => {
                element.valor = Number(element.valor);
                element.cantidad = Number(element.cantidad);
                this.totalCantidadClientesCanal += element.cantidad;
                this.totalValorClientesCanal += element.valor;
            });
        })
    }

    getClientesOperador() {
        this.totalCantidadClientesOperador = 0;
        this.totalValorClientesOperador = 0;
        this.spinRecargasClienteOperador = true;
        this.salesReportService.getClienteOperador().subscribe((data: any) => {
            this.spinRecargasClienteOperador = false;
            if (!data.bRta) return;
            this.listRecargasClienteOperador = data.data;
            this.listRecargasClienteOperador.forEach(element => {
                element.valor = Number(element.valor);
                element.cantidad = Number(element.cantidad);
                this.totalCantidadClientesOperador += element.cantidad;
                this.totalValorClientesOperador += element.valor;
            });
        })
    }

    getDetalleRecarga(dataCliente,dataCanal,dataOperador, tipoDetalle) {

        this.listRecargasCliente = [];
        this.spinRecargasCliente = true;
        this.tipoDetalle = tipoDetalle;

        if (this.tipoDetalle == 'cliente') {
            this.recargaSeleccionada = dataCliente;
            this.salesReportService.getDetalleRecargaPorCliente(this.recargaSeleccionada.id_cliente.toString()).subscribe((data: any) => {
                this.spinRecargasCliente = false;
                if (!data.bRta) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay información disponible' });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Información encontrada correctamente' });
                this.listRecargasCliente = data.data;
            })
        }
        else if (this.tipoDetalle == 'canal') {
            this.canalSeleccionado = dataCanal;
            this.salesReportService.getDetalleRecargaPorCanal(this.canalSeleccionado.canal).subscribe((data: any) => {
                this.spinRecargasCliente = false;
                if (!data.bRta) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay información disponible' });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Información encontrada correctamente' });
                this.listRecargasCliente = data.data;
            })
        }
        else if (this.tipoDetalle == 'operador') {
            this.operadorSeleccionado = dataOperador;
            this.salesReportService.getDetalleRecargaPorOperador(this.operadorSeleccionado.operador).subscribe((data: any) => {
                this.spinRecargasCliente = false;
                if (!data.bRta) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay información disponible' });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Información encontrada correctamente' });
                this.listRecargasCliente = data.data;
            })
        }

    }

    getTopCanal() {
        this.spinTopCanal = true;
        this.totalVentasTopCanal = 0;
        this.salesReportService.getTopCanal().subscribe((data: any) => {
            this.spinTopCanal = false;
            if (!data.bRta) return;
            this.listTopCanal = data.data;
            this.listTopCanal.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
                this.totalCantidadTopCanal += element.cantidad;
                this.totalVentasTopCanal += element.valor;
            });
        })
    }

    getTopOperador() {
        this.spinTopOperador = true;
        this.totalVentasTopOperador = 0;
        this.salesReportService.getTopOperador().subscribe((data: any) => {
            this.spinTopOperador = false;
            if (!data.bRta) return;
            this.listTopOperador = data.data;
            this.listTopOperador.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
                this.totalCantidadTopOperador += element.cantidad;
                this.totalVentasTopOperador += element.valor;
            });
        })
    }

    getTopCliente() {
        this.spinTopCliente = true;
        this.totalVentasTopCliente = 0;
        this.salesReportService.getTopCliente().subscribe((data: any) => {
            this.spinTopCliente = false;
            if (!data.bRta) return;
            this.listTopCliente = data.data;
            this.listTopCliente.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
                this.totalCantidadTopCliente += element.cantidad;
                this.totalVentasTopCliente += element.valor;
            });
        })
    }

    getTopComisiones() {
        this.spinTopComision = true;
        this.salesReportService.getTopComisiones().subscribe((data: any) => {
            this.spinTopComision = false;
            if (!data.bRta) return;
            this.listTopComision = data.data;
            this.listTopComision.forEach(element => {
                element.valor = Number(element.valor);
                element.comision = Number(element.comision);
            });
        })
    }

    async onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.readSalesReport();
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
    }

    async readSalesReport() {
        for (const element of this.uploadedFiles) {
            let reader = new FileReader();
            reader.readAsText(element);
            reader.onloadend = () => {
                let csvData = reader.result;
                let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                let headersRow = this.getHeaderArray(csvRecordsArray);
                this.listRecargas = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
            };
        }
        await this.timeout(200);
        this.saveSalesReport();
    }

    async saveSalesReport() {
        this.showProgressBar = true;
        let dataSubir = this.listRecargas.length;
        let contador = 1;
        for (const recarga of this.listRecargas) {
            const dateParts = recarga.fecha.split("/");
            recarga.fecha = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
            await lastValueFrom(this.salesReportService.newSalesReporte(recarga)).then((data: any) => { });
            this.valueProgressBar = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de recargas' });
        this.initData();
        this.showProgressBar = false;

    }

    getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let curruntRecord = (<string>csvRecordsArray[i]).split(',');
            if (curruntRecord.length == headerLength) {
                let csvRecord: Sales_report = {
                    id_transaccion: curruntRecord[0].trim(),
                    id_cliente: Number(curruntRecord[1].trim()),
                    cliente: curruntRecord[2].trim(),
                    canal: curruntRecord[3].trim(),
                    operador: curruntRecord[4].trim(),
                    linea: curruntRecord[5].trim(),
                    id_convenio: curruntRecord[6].trim(),
                    nombre_convenio: curruntRecord[7].trim(),
                    comision: Number(curruntRecord[8].trim()),
                    fecha: curruntRecord[9].trim(),
                    hora: curruntRecord[10].trim(),
                    valor: Number(curruntRecord[11].trim()),
                    saldo_final: Number(curruntRecord[12].trim()),
                    bolsa: curruntRecord[13].trim(),
                    estado: curruntRecord[14].trim(),
                    usuario: curruntRecord[15].trim(),
                    creado_por: curruntRecord[16].trim(),
                };
                csvArr.push(csvRecord);
            }
        }
        return csvArr;
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Filtros Por fecha
    getClientesCanalPorFecha() {
        let fechaInicial = this.rangoFechasClientesCanal[0] != null ? this.formatDate(this.rangoFechasClientesCanal[0]) : null;
        let fechaFinal = this.rangoFechasClientesCanal[1] != null ? this.formatDate(this.rangoFechasClientesCanal[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.totalCantidadClientesCanal = 0;
        this.totalValorClientesCanal = 0;
        this.listRecargasClienteCanal = [];
        this.spinRecargasClienteCanal = true;
        this.salesReportService.getClienteCanalFiltroFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinRecargasClienteCanal = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listRecargasClienteCanal = data.data;
            this.listRecargasClienteCanal.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
                this.totalCantidadClientesCanal += element.cantidad;
                this.totalValorClientesCanal += element.valor;
            });
        })
    }

    getClientesOperadorPorFecha() {
        let fechaInicial = this.rangoFechasClientesOperador[0] != null ? this.formatDate(this.rangoFechasClientesOperador[0]) : null;
        let fechaFinal = this.rangoFechasClientesOperador[1] != null ? this.formatDate(this.rangoFechasClientesOperador[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.totalCantidadClientesOperador = 0;
        this.totalValorClientesOperador = 0;
        this.listRecargasClienteOperador = [];
        this.spinRecargasClienteOperador = true;
        this.salesReportService.getClienteOperadorFiltroFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinRecargasClienteOperador = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listRecargasClienteOperador = data.data;
            this.listRecargasClienteOperador.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
                this.totalCantidadClientesOperador += element.cantidad;
                this.totalValorClientesOperador += element.valor;
            });
        })
    }

    getClientesRecargasPorFecha() {
        let fechaInicial = this.rangoFechasClientesRecargas[0] != null ? this.formatDate(this.rangoFechasClientesRecargas[0]) : null;
        let fechaFinal = this.rangoFechasClientesRecargas[1] != null ? this.formatDate(this.rangoFechasClientesRecargas[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listRecargasCliente = [];
        this.spinRecargasCliente = true;
        this.salesReportService.getDetalleRecargaPorClienteFechas(this.recargaSeleccionada.id_cliente.toString(), fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinRecargasCliente = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listRecargasCliente = data.data;
            this.listRecargasCliente.forEach(element => {
                element.comision = Number(element.comision);
                element.valor = Number(element.valor);
            });
        })
    }

    getTopCanalFechas() {
        let fechaInicial = this.rangoFechasTopCanal[0] != null ? this.formatDate(this.rangoFechasTopCanal[0]) : null;
        let fechaFinal = this.rangoFechasTopCanal[1] != null ? this.formatDate(this.rangoFechasTopCanal[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listTopCanal = [];
        this.spinTopCanal = true;
        this.salesReportService.getTopCanalFechas(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinTopCanal = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listTopCanal = data.data;
            this.listTopCanal.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
            });
        })
    }

    getTopOperadorFechas() {
        let fechaInicial = this.rangoFechasTopOperador[0] != null ? this.formatDate(this.rangoFechasTopOperador[0]) : null;
        let fechaFinal = this.rangoFechasTopOperador[1] != null ? this.formatDate(this.rangoFechasTopOperador[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listTopOperador = [];
        this.spinTopOperador = true;
        this.salesReportService.getTopCanalFechas(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinTopOperador = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listTopOperador = data.data;
            this.listTopOperador.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
            });
        })
    }

    getTopClientesFechas() {
        let fechaInicial = this.rangoFechasTopCliente[0] != null ? this.formatDate(this.rangoFechasTopCliente[0]) : null;
        let fechaFinal = this.rangoFechasTopCliente[1] != null ? this.formatDate(this.rangoFechasTopCliente[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listTopCliente = [];
        this.spinTopCliente = true;
        this.salesReportService.getTopCanalFechas(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinTopCliente = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listTopCliente = data.data;
            this.listTopCliente.forEach(element => {
                element.cantidad = Number(element.cantidad);
                element.valor = Number(element.valor);
            });
        })
    }

    getTopComisionesFechas() {
        let fechaInicial = this.rangoFechasTopComisiones[0] != null ? this.formatDate(this.rangoFechasTopComisiones[0]) : null;
        let fechaFinal = this.rangoFechasTopComisiones[1] != null ? this.formatDate(this.rangoFechasTopComisiones[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listTopComision = [];
        this.spinTopComision = true;
        this.salesReportService.getTopComisionesFechas(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinTopComision = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listTopComision = data.data;
            this.listTopComision.forEach(element => {
                element.comision = Number(element.comision);
            });
        })
    }


    //Totalizados
    filtroClientesCanal(event, dt) {
        this.totalCantidadClientesCanal = 0;
        this.totalValorClientesCanal = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalCantidadClientesCanal += Number(element.cantidad);
            this.totalValorClientesCanal += Number(element.valor);
        });
    }

    filtroClientesOperador(event, dt) {
        this.totalCantidadClientesOperador = 0;
        this.totalValorClientesOperador = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalCantidadClientesOperador += Number(element.cantidad);
            this.totalValorClientesOperador += Number(element.valor);
        });
    }

    filtroClientesRecargas(event, dt) {
        this.totalVentasClientesRecargas = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalVentasClientesRecargas += Number(element.valor);
        });
    }

    filtroTopCanal(event, dt) {
        this.totalVentasTopCanal = 0;
        this.totalCantidadTopCanal = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalVentasTopCanal += Number(element.valor);
            this.totalCantidadTopCanal += Number(element.cantidad);
        });
    }

    filtroTopOperador(event, dt) {
        this.totalVentasTopOperador = 0;
        this.totalCantidadTopOperador = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalVentasTopOperador += Number(element.valor);
            this.totalCantidadTopOperador += Number(element.cantidad);
        });
    }

    filtroTopCliente(event, dt) {
        this.totalVentasTopCliente = 0;
        this.totalCantidadTopCliente = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalVentasTopCliente += Number(element.valor);
            this.totalCantidadTopCliente += Number(element.cantidad);
        });
    }


    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableClientesCanal:
                this.getClientesCanal();
                this.rangoFechasClientesCanal = [];
                break;
            case this.tableClientesOperador:
                this.getClientesOperador();
                this.rangoFechasClientesOperador = [];
                break;
            case this.tableRecargasCliente:
                this.getDetalleRecarga(this.recargaSeleccionada,this.canalSeleccionado,this.operadorSeleccionado, this.tipoDetalle);
                this.rangoFechasClientesRecargas = [];
                break;
            case this.tableTopCanal:
                this.getTopCanal();
                this.rangoFechasTopCanal = [];
                break;
            case this.tableTopOperador:
                this.getTopOperador();
                this.rangoFechasTopOperador = [];
                break;
            case this.tableTopCliente:
                this.getTopCliente();
                this.rangoFechasTopCliente = [];
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
