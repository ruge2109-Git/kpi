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
    listIndicadores: EXA_Indicadores[] = [];
    indicadorSeleccionado: EXA_Indicadores;


    //Spiners
    spinIndicadores: boolean = false;
    spinDetalle: boolean = false;

    //Vista
    @ViewChild('tableIndicadores') tableIndicadores: Table;
    @ViewChild('tableDetalle') tableDetalle: Table;


    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    //Filtros
    rangoFechasIndicadores: Date[] = [];
    rangoFechasDetalle: Date[] = [];

    //Totales
    totalValorDetalle: number = 0;


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
            });
        })
    }

    getIndicadoresPorFecha() {
        let fechaInicial = this.rangoFechasIndicadores[0] != null ? this.formatDate(this.rangoFechasIndicadores[0]) : null;
        let fechaFinal = this.rangoFechasIndicadores[1] != null ? this.formatDate(this.rangoFechasIndicadores[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinIndicadores = true;
        this.listIndicadores = [];
        this.extractoAhorroService.getIndicadoresPorFecha(fechaInicial,fechaFinal).subscribe((data: any) => {
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
    }

    filtroTotalizadoDetalle(event, dt) {
        this.totalValorDetalle = 0;
        let dataFiltrada = event.filteredValue;
        dataFiltrada.forEach(element => {
            this.totalValorDetalle += Number(element.valor);
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
            default:
                break;
        }
    }

}
