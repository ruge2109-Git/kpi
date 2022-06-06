import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import readXlsxFile from 'read-excel-file';
import { lastValueFrom } from 'rxjs';
import { MIEn_Respuesta } from 'src/app/models/MiEntretenimiento';
import { MiEntretenimientoService } from 'src/app/service/mi-entretenimiento.service';

@Component({
    selector: 'app-rta-cuentas',
    templateUrl: './rta-cuentas.component.html',
    styleUrls: ['./rta-cuentas.component.scss']
})
export class RtaCuentasComponent implements OnInit {

    //Archivos
    uploadedFiles: any[] = [];

    //Listas
    listNewRtas: MIEn_Respuesta[] = [];
    listRtasGeneral: MIEn_Respuesta[] = [];
    listRtas: MIEn_Respuesta[] = [];

    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    //Rango fechas
    rangoFechasData: Date[] = [];

    //Spinners
    spinData: boolean = false;

    //Tablas
    @ViewChild('tableData') tableData: Table;

    constructor(private messageService: MessageService, private miEntretenimientoService: MiEntretenimientoService) { }

    ngOnInit(): void {
        this.initData();
    }

    //Get information
    initData() {
        this.listRtas = [];
        this.miEntretenimientoService.getDataRespuesta().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listRtasGeneral = data.data;
            this.listRtas = data.data;
        })
    }

    getDataFecha() {
        let startDate = this.rangoFechasData[0] != null ? this.rangoFechasData[0] : null;
        let endDate = this.rangoFechasData[1] != null ? this.rangoFechasData[1] : null;
        if (startDate == null) return;
        if (endDate == null) {
            endDate = new Date(startDate);
        }
        endDate.setHours(23, 59, 59);
        this.listRtas = this.listRtasGeneral.filter((element) => {

            let currentDate = new Date(element.fecha_respuesta);
            if ((currentDate >= startDate && currentDate <= endDate)) {
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
                    let data: MIEn_Respuesta = {
                        id: element2[0] + "",
                        cuenta_afectada: element2[1] + "",
                        password: btoa(element2[2] + ""),
                        resuelto: element2[3] + "",
                        fecha_respuesta: this.parsearFecha(element2[4] + ""),
                        respuesta: btoa(element2[5] + "")
                    }
                    this.listNewRtas.push(data);
                }
            })
        }
        this.saveRespuesta();
        this.initData();
    }

    //Guardar información
    async saveRespuesta() {
        this.showProgressBar = true;
        let dataSubir = this.listNewRtas.length;
        let contador = 1;

        for (const respuesta of this.listNewRtas) {

            await lastValueFrom(this.miEntretenimientoService.newRespuesta(respuesta)).then((data: any) => { });
            this.valueProgressBar = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de respuestas' });
        this.showProgressBar = false;
    }


    parsearFecha(fecha: string) {
        if (fecha == 'no registra') return null;
        let fechaHora = fecha.split(' ');
        let datosFecha = fechaHora[0].split('/');
        return `${datosFecha[2]}-${datosFecha[1]}-${datosFecha[0]} ${fechaHora[1]}`;
    }


    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableData:
                this.initData();
                this.rangoFechasData = [];
                break;
            default:
                break;
        }
    }

}
