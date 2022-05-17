import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import readXlsxFile from 'read-excel-file';
import { lastValueFrom } from 'rxjs';
import { EX_Informe_reparto } from 'src/app/models/extractos';
import { InformeRepartoService } from 'src/app/service/informe-reparto.service';

@Component({
    selector: 'app-extractos',
    templateUrl: './extractos.component.html',
    styleUrls: ['./extractos.component.scss']
})
export class ExtractosComponent implements OnInit {

    //Archivos
    uploadedFiles: any[] = [];

    //Listas
    listExtractos: EX_Informe_reparto[] = [];

    //Spiners

    //Progreso
    showProgressBar: boolean = false;
    valueProgressBar: number = 1;

    constructor(private messageService: MessageService, private informeRepartoService:InformeRepartoService) { }

    ngOnInit(): void {
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
                    if (index === 0 || index === (rows.length - 1)) {
                        continue;
                    }
                    const fechaAprobacion = element2[9].toString().split("/");
                    const fechaDeposito = element2[11].toString().split("/");
                    const fechaRegistro = element2[23].toString().split("/");
                    let extractoObj: EX_Informe_reparto = {
                        consecutivo: Number(element2[0]+""),
                        tipo_informe: element2[1]+"",
                        id_cliente: Number(element2[2]+""),
                        cliente: element2[3]+"",
                        solicitante: element2[4]+"",
                        valor_compra: Number(element2[5]+""),
                        valor_comision: Number(element2[6]+""),
                        valor_acreditado: Number(element2[7]+""),
                        tipo_movimiento: element2[8]+"",
                        fecha_aprobacion: fechaAprobacion[2] + "-" + fechaAprobacion[1] + "-" + fechaAprobacion[0],
                        hora_aprobacion: element2[10]+"",
                        fecha_deposito: fechaDeposito[2] + "-" + fechaDeposito[1] + "-" + fechaDeposito[0],
                        hora_deposito: element2[12]+"",
                        num_reparto: element2[13]+"",
                        tarjeta_recaudo: element2[14]+"",
                        banco: element2[15]+"",
                        pdc: element2[16]+"",
                        detalle_pdf: element2[17]+"",
                        cuenta: element2[18]+"",
                        num_comprobante: element2[19]+"",
                        num_CashOut: element2[20]+"",
                        tipo: element2[21]+"",
                        usuario_responsable: element2[22]+"",
                        fecha_registro: fechaRegistro[2] + "-" + fechaRegistro[1] + "-" + fechaRegistro[0],
                        hora_registro: element2[24]+"",
                        observacion: element2[25]+"",
                        modo: element2[26]+""
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
        for (const infoReparto of this.listExtractos) {
            await lastValueFrom(this.informeRepartoService.newInformeReparto(infoReparto)).then((data: any) => { });
            this.valueProgressBar = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de movimientos' });
        this.initData();
        this.showProgressBar = false;

    }

    initData() {}

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
