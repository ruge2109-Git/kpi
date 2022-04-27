import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TiendaOnline, TO_ComprasPorPersona, TO_ProductosMasVendidos } from 'src/app/models/tienda-online';
import readXlsxFile from 'read-excel-file';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-tienda-online',
    templateUrl: './tienda-online.component.html',
    styleUrls: ['./tienda-online.component.scss']
})
export class TiendaOnlineComponent implements OnInit {

    uploadedFiles: any[] = [];
    listTiendaOnline: TiendaOnline[] = [];
    listProductosMasVendidos: TO_ProductosMasVendidos[] = [];
    listComprasPorPersona: TO_ComprasPorPersona[] = [];

    loading: boolean = false;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild('filter2') filter2: ElementRef;
    @ViewChild('dt1') tableOne: Table;
    @ViewChild('dt2') tableTwo: Table;
    @ViewChild('dt3') tableThree: Table;

    //Grafico de barras
    barOptions: any;
    barData: any;

    constructor(private messageService: MessageService, private datePipe: DatePipe) { }

    ngOnInit(): void {
    }

    onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
        this.readExcel();
    }

    readExcel() {
        this.loading = true;
        setTimeout(() => {
            this.uploadedFiles.forEach(element => {
                readXlsxFile(element).then((rows) => {
                    rows.forEach((element: any) => {
                        let tiendaOnlineObj: TiendaOnline = {
                            cod_tienda_streaming: element[0],
                            fecha_transaccion: element[1].replace(" | ", "T").replace(" ", "\/"),
                            usuario_cliente: element[2],
                            usuario_vendedor: element[3],
                            descripcion: element[4],
                            saldo: element[5],
                            saldo_adicional: Number(element[6].replace(/\$|\.|\+| |\-/g, '')),
                            saldo_total: element[7]
                        };
                        this.listTiendaOnline.push(tiendaOnlineObj);
                    });
                    this.clear(this.tableOne)
                    this.getProductosMasVendidos();
                    this.getBarChart();
                    this.getComprasPorPersona();
                })
            });
            this.loading = false;
        }, 100);
    }

    getProductosMasVendidos() {
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas = listaVentas.map((movimiento) => {
            movimiento.producto = movimiento.descripcion.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();
            return movimiento;
        })
        listaVentas.forEach(element => {
            if (this.listProductosMasVendidos.length == 0) {
                this.listProductosMasVendidos.push({ nombre_producto: element.producto, cantidad: 1 });
            }
            else {
                let encontrado = false;
                let contadorEncontrado = 0;
                for (let i = 0; i < this.listProductosMasVendidos.length; i++) {
                    const masVendidos = this.listProductosMasVendidos[i];
                    if (masVendidos.nombre_producto == element.producto) {
                        encontrado = true;
                        contadorEncontrado = i;
                    }
                }
                if (!encontrado) {
                    this.listProductosMasVendidos.push({ nombre_producto: element.producto, cantidad: 1 });
                }
                else {
                    this.listProductosMasVendidos[contadorEncontrado].cantidad = this.listProductosMasVendidos[contadorEncontrado].cantidad + 1;
                }
            }
        });
        this.listProductosMasVendidos.sort((a, b) => {
            if (a.cantidad < b.cantidad) {
                return 1;
            }
            if (a.cantidad > b.cantidad) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        this.clear(this.tableTwo)
    }

    getComprasPorPersona() {
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas = listaVentas.map((movimiento) => {
            movimiento.producto = movimiento.descripcion.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();
            return movimiento;
        })
        listaVentas.forEach(element => {
            if (this.listComprasPorPersona.length == 0) {
                this.listComprasPorPersona.push({ nombre_producto: element.producto, cantidad_ventas: 1, total_vendido: element.saldo_adicional, nombre_persona: element.usuario_cliente });
            }
            else {
                let encontrado = false;
                let contadorEncontrado = 0;
                for (let i = 0; i < this.listComprasPorPersona.length; i++) {
                    const masVendidos = this.listComprasPorPersona[i];
                    if (masVendidos.nombre_producto == element.producto && masVendidos.nombre_persona == element.usuario_cliente) {
                        encontrado = true;
                        contadorEncontrado = i;
                    }
                }
                if (!encontrado) {
                    this.listComprasPorPersona.push({ nombre_producto: element.producto, cantidad_ventas: 1, total_vendido: element.saldo_adicional, nombre_persona: element.usuario_cliente });
                }
                else {
                    this.listComprasPorPersona[contadorEncontrado].cantidad_ventas = this.listComprasPorPersona[contadorEncontrado].cantidad_ventas + 1;
                    this.listComprasPorPersona[contadorEncontrado].total_vendido = this.listComprasPorPersona[contadorEncontrado].total_vendido + element.saldo_adicional;
                }
            }
        });
        this.listComprasPorPersona.sort((a, b) => {
            if (a.cantidad_ventas < b.cantidad_ventas) {
                return 1;
            }
            if (a.cantidad_ventas > b.cantidad_ventas) {
                return -1;
            }
            return 0;
        });
        this.clear(this.tableThree);
    }

    getBarChart() {
        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#2f4860',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#00bb7e',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
    }

    clear(table: Table) {
        table.clear();
        if (table == this.tableOne) {
            this.filter.nativeElement.value = '';
        }
        if (table == this.tableThree) {
            this.filter2.nativeElement.value = '';
        }

    }


}
