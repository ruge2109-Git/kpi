import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TiendaOnline, TO_ComprasPorPersona, TO_DetalleRecarga, TO_IndicadoresGenerales, TO_PersonasMasVentas, TO_Producto, TO_ProductosMasVendidos, TO_Recargas } from 'src/app/models/tienda-online';
import readXlsxFile from 'read-excel-file';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { TiendaOnlineService } from 'src/app/service/tienda-online.service';

@Component({
    selector: 'app-tienda-online',
    templateUrl: './tienda-online.component.html',
    styleUrls: ['./tienda-online.component.scss']
})
export class TiendaOnlineComponent implements OnInit {

    //Listas
    uploadedFiles: any[] = [];
    listTiendaOnline: TiendaOnline[] = [];
    listDetalleVenta: TiendaOnline[] = [];
    listProductosMasVendidos: TO_ProductosMasVendidos[] = [];
    listPersonasMasVentas: TO_PersonasMasVentas[] = [];
    listVentasPorPersona: TO_ComprasPorPersona[] = [];
    listIndicadores: TO_IndicadoresGenerales[] = [];
    listProductos: TO_Producto[] = [];
    listRecargas: TO_Recargas[] = [];
    listRecargasTotalizados: TO_Recargas[] = [];
    listDetalleRecargas: TO_DetalleRecarga[] = [];

    //Totalizados
    comprasPorPersonaTotal: TO_ComprasPorPersona[] = [];

    //Vista
    loading: boolean = false;
    cargandoArchivos: boolean = true;
    @ViewChild('tableVXP') tableVXP: Table;
    @ViewChild('tableVentasYProducto') tableVentasYProducto: Table;
    @ViewChild('tableProductos') tableProductos: Table;
    @ViewChild('tableVentasXPersona') tableVentasXPersona: Table;
    @ViewChild('tableRecargas') tableRecargas: Table;
    @ViewChild('tableRecargasTotal') tableRecargasTotal: Table;
    @ViewChild('tableDetalleRecargas') tableDetalleRecargas: Table;
    @ViewChild('tableDetalleVenta') tableDetalleVenta: Table;

    @ViewChild('filterProd') filterProd: ElementRef;
    @ViewChild('filterRecar') filterRecar: ElementRef;
    @ViewChild('filterVentasProdPerso') filterVentasProdPerso: ElementRef;
    @ViewChild('filterDetalleVenta') filterDetalleVenta: ElementRef;
    @ViewChild('filterRecarTota') filterRecarTota: ElementRef;

    //Grafico de barras
    barOptions: any;
    barData: any;

    constructor(private messageService: MessageService, private datePipe: DatePipe, private tiendaService: TiendaOnlineService) { }

    ngOnInit(): void {
        this.getProductosDatabase();
        this.getTiendaOnlineDatabase();
    }

    initData() {
        this.getIndicadores();
        this.getProductosMasVendidos();
        this.getPersonasConMasVentas();
        this.getRecargas();
        this.getRecargasTotalizado();
    }

    onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
        this.readExcel();
    }

    getProductosDatabase() {
        this.tiendaService.getProductos().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listProductos = data.data.map(element => {
                return {
                    cod_producto: element.cod_producto,
                    nombre: element.nombre,
                    costo_unitario: element.costo
                }
            });;
        })
    }

    getTiendaOnlineDatabase() {
        this.cargandoArchivos = true;
        this.tiendaService.getTiendaOnline().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listTiendaOnline = data.data;
            this.initData();
            this.cargandoArchivos = false;
        })
    }

    readExcel() {
        this.loading = true;
        this.uploadedFiles.forEach(element => {
            readXlsxFile(element).then((rows) => {
                rows.forEach((element: any) => {
                    let descripcion = this.obtenerDescripcion(element[4]);
                    let producto = this.obtenerProducto(element[4]);
                    let idTransaccion = this.obtenerIdTransaccion(element[4]);
                    let valorVenta = this.obtenerValorDeLaVenta(element[4]);
                    let tiendaOnlineObj: TiendaOnline = {
                        cod_tienda_streaming: element[0],
                        fecha_transaccion: this.parsearFecha(element[1].replace(" | ", "T").replace(" ", "\/")),
                        usuario_cliente: element[2],
                        usuario_vendedor: element[3],
                        descripcion: descripcion,
                        producto: producto,
                        id_transaccion: idTransaccion,
                        saldo: element[5],
                        saldo_adicional: Number(element[6].replace(/\$|\.|\+| |\-/g, '')),
                        saldo_total: element[7],
                        valor_venta: Number(valorVenta.replace(/\$|\.|\+| |\-/g, ''))
                    };
                    let buscarEnLaLista = this.listTiendaOnline.filter((movimiento) => movimiento == tiendaOnlineObj);
                    if (buscarEnLaLista.length == 0) {
                        this.listTiendaOnline.push(tiendaOnlineObj);
                        this.saveMovimiento(tiendaOnlineObj, false);
                    }
                });
                this.initData();
            })
        });
        this.loading = false;
        this.cargandoArchivos = false;

    }

    getIndicadores() {
        this.listIndicadores = [];
        this.tiendaService.getIndicadores().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listIndicadores = data.data.map((data) => {
                return {
                    nombre_indicador: "Total de " + data.titulo,
                    icono: 'pi-shopping-cart',
                    valor: data.total,
                    esMoneda: true,
                    descripcion: 'Cantidad de ' + data.titulo,
                    resaltado: data.cantidad
                }
            });
        })

    }

    getProductosMasVendidos() {
        // let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        // listaVentas.forEach(element => {
        //     if (this.listProductosMasVendidos.length == 0) {
        //         this.listProductosMasVendidos.push({ nombre_producto: element.producto, cantidad: 1 });
        //     }
        //     else {
        //         let encontrado = false;
        //         let contadorEncontrado = 0;
        //         for (let i = 0; i < this.listProductosMasVendidos.length; i++) {
        //             const masVendidos = this.listProductosMasVendidos[i];
        //             if (masVendidos.nombre_producto == element.producto) {
        //                 encontrado = true;
        //                 contadorEncontrado = i;
        //             }
        //         }
        //         if (!encontrado) {
        //             this.listProductosMasVendidos.push({ nombre_producto: element.producto, cantidad: 1 });
        //         }
        //         else {
        //             this.listProductosMasVendidos[contadorEncontrado].cantidad = this.listProductosMasVendidos[contadorEncontrado].cantidad + 1;
        //         }
        //     }
        // });
        // this.listProductosMasVendidos.sort((a, b) => {
        //     if (a.cantidad < b.cantidad) {
        //         return 1;
        //     }
        //     if (a.cantidad > b.cantidad) {
        //         return -1;
        //     }
        //     return 0;
        // });
        // this.clear(this.tableVXP)
    }

    getPersonasConMasVentas() {
        // let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        // listaVentas.forEach(element => {
        //     if (this.listPersonasMasVentas.length == 0) {
        //         this.listPersonasMasVentas.push({ nombre_persona: element.usuario_cliente, cantidad: 1 });
        //     }
        //     else {
        //         let encontrado = false;
        //         let contadorEncontrado = 0;
        //         for (let i = 0; i < this.listPersonasMasVentas.length; i++) {
        //             const masVendidos = this.listPersonasMasVentas[i];
        //             if (masVendidos.nombre_persona == element.usuario_cliente) {
        //                 encontrado = true;
        //                 contadorEncontrado = i;
        //             }
        //         }
        //         if (!encontrado) {
        //             this.listPersonasMasVentas.push({ nombre_persona: element.usuario_cliente, cantidad: 1 });
        //         }
        //         else {
        //             this.listPersonasMasVentas[contadorEncontrado].cantidad = this.listPersonasMasVentas[contadorEncontrado].cantidad + 1;
        //         }
        //     }
        // });
        // this.listPersonasMasVentas.sort((a, b) => {
        //     if (a.cantidad < b.cantidad) {
        //         return 1;
        //     }
        //     if (a.cantidad > b.cantidad) {
        //         return -1;
        //     }
        //     return 0;
        // });
        // this.clear(this.tableVentasXPersona)
    }

    getComprasPorPersona(productoSeleccionado: string, personaSeleccionada: string) {
        this.listVentasPorPersona = [];
        this.comprasPorPersonaTotal = [];
        this.tiendaService.getVentasPorPersona(personaSeleccionada, productoSeleccionado).subscribe((data: any) => {
            if (!data.bRta) return;
            this.listVentasPorPersona = data.data;
            let dataNueva: TO_ComprasPorPersona = {
                nombre_persona: '',
                nombre_producto: '',
                cantidad_ventas: 0,
                valor_unitario: 0,
                valor_total: 0,
                costo: 0,
                utilidad: 0,
            };
            this.listVentasPorPersona.forEach(element => {
                dataNueva.nombre_persona = element.nombre_persona;
                dataNueva.cantidad_ventas += Number(element.cantidad_ventas);
                dataNueva.valor_unitario += Number(element.valor_unitario);
                dataNueva.valor_total += Number(element.valor_total);
                dataNueva.costo += Number(element.costo);
                dataNueva.utilidad += Number(element.utilidad);
            });
            this.comprasPorPersonaTotal.push(dataNueva);
        })
        this.clear(this.tableVentasYProducto);
    }

    getProductos() {
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas.forEach(element => {
            let existe = this.listProductos.filter((prod) => prod.nombre == element.producto);
            if (existe.length == 0) {
                this.listProductos.push({ nombre: element.producto, costo_unitario: 0 });
            }
        });
        this.listProductos.forEach(element => {
            this.saveProducto(element, false);
        })

        this.clear(this.tableProductos);
    }

    getRecargas() {
        this.tiendaService.getRecargas().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listRecargas = data.data;
            this.clear(this.tableRecargas);
        })
    }

    getRecargasTotalizado() {
        this.tiendaService.getRecargasTotalizado().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listRecargasTotalizados = data.data;
            this.clear(this.tableRecargas);
        })
    }

    getDetalleRecarga(recargaP: TO_Recargas) {
        this.listDetalleRecargas = [];

        this.tiendaService.getDetalleRecarga(recargaP.cliente, recargaP.fecha_recarga).subscribe((data: any) => {
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han realizado transacciones ' });
                return;
            };
            this.listDetalleRecargas = data.data.map((data) => {
                return {
                    persona: data.persona,
                    producto: data.producto,
                    total_recarga: data.recarga,
                    total_ventas: data.total_ventas,
                    balance: data.recarga - data.total_ventas
                }
            });
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Detalle encontrado' });
            this.clear(this.tableDetalleRecargas);
        })
    }

    getDetalleVenta(compraPorPersona: TO_ComprasPorPersona) {
        this.listDetalleVenta = [];
        this.tiendaService.getDetalleVenta(compraPorPersona.nombre_persona, compraPorPersona.nombre_producto).subscribe((data: any) => {
            if (!data.bRta) return;
            this.listDetalleVenta = data.data;
            this.clear(this.tableDetalleVenta);
        })
    }


    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableProductos:
                this.filterProd.nativeElement.value = '';
                break;
            case this.tableRecargas:
                this.filterRecar.nativeElement.value = '';
                break;
            case this.tableVentasYProducto:
                this.filterVentasProdPerso.nativeElement.value = '';
                break;
            case this.tableDetalleVenta:
                this.filterDetalleVenta.nativeElement.value = '';
                break;
            case this.tableRecargasTotal:
                this.filterRecarTota.nativeElement.value = '';
                break;

            default:
                break;
        }
    }

    // ***********
    // Desglosar información
    // ***********
    parsearFecha(fecha: string) {
        let fechaCalendario = fecha.split('T')[0];
        let datosFecha = fechaCalendario.split('/');
        let mes = "01";
        switch (datosFecha[1].toLowerCase()) {
            case "ene":
                mes = "01";
                break;
            case "feb":
                mes = "02";
                break;
            case "mar":
                mes = "03";
                break;
            case "abr":
                mes = "04";
                break;
            case "may":
                mes = "05";
                break;
            case "jun":
                mes = "06";
                break;
            case "jul":
                mes = "07";
                break;
            case "ago":
                mes = "08";
                break;
            case "sep":
                mes = "09";
                break;
            case "oct":
                mes = "10";
                break;
            case "nov":
                mes = "11";
                break;
            case "dic":
                mes = "12";
                break;
            default:
                break;
        }
        return datosFecha[0] + "-" + mes + "-" + datosFecha[2];
    }

    obtenerDescripcion(descripcionDB: string) {

        if (descripcionDB.includes('Venta de Producto')) {
            return 'Venta de Producto';
        }
        if (descripcionDB.includes('Comision venta por')) {
            return 'Comision venta por';
        }
        if (descripcionDB.includes('Recarga directa por el Administrador')) {
            return 'Recarga directa por el Administrador';
        }
        if (descripcionDB.includes('Recarga directa por el Administrador')) {
            return 'Recarga directa por el Administrador';
        }
        if (descripcionDB.includes('Descuento de mi saldo por recarga a distribuidor')) {
            return 'Descuento de mi saldo por recarga a distribuidor';
        }
        if (descripcionDB.includes('Recarga de mi saldo por el supervisor')) {
            return 'Recarga de mi saldo por el supervisor';
        }
        if (descripcionDB.includes('Reverso de saldo')) {
            return 'Reverso de saldo';
        }
        if (descripcionDB.includes('Reverso de saldo por el Administrador')) {
            return 'Reverso de saldo por el Administrador';
        }
        return "";
    }

    obtenerProducto(descripcionDB: string) {

        if (descripcionDB.includes('Venta de Producto')) {
            return descripcionDB.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();;
        }
        if (descripcionDB.includes('Comision venta por')) {
            return descripcionDB.split('-')[1].split('id')[0].trim();;
        }

        return "";
    }

    obtenerIdTransaccion(descripcionDB: string) {
        if (descripcionDB.includes('Venta de Producto') || descripcionDB.includes('Comision venta')) {
            let splitId = descripcionDB.split('id - ');
            let splitIdEspacios = splitId[splitId.length - 1].split(' ');
            return splitIdEspacios[0];
        }
        return "";
    }

    obtenerValorDeLaVenta(descripcionDB: string) {
        if (descripcionDB.includes('Comision venta')) {
            let splitId = descripcionDB.split('Valor Venta');
            return splitId[splitId.length - 1];
        }
        return '0';
    }

    saveProducto(prod: TO_Producto, mostrar: boolean) {
        this.tiendaService.newProducto(prod).subscribe((data: any) => {
            if (!mostrar) return;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'Ocurrio un error al intentar guardar el producto' });
                return;
            }
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se guardo el producto correctamente' });
        })
    }

    saveMovimiento(tiendaOnline: TiendaOnline, mostrar: boolean) {
        this.tiendaService.newMovimientoTiendaOnline(tiendaOnline).subscribe((data: any) => {
            if (!mostrar) return;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'Ocurrio un error al intentar guardar el movimiento' });
                return;
            }
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se guardo el movimiento correctamente' });
        })
    }


}
