import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TiendaOnline, TO_ComprasPorPersona, TO_DetalleRecarga, TO_IndicadoresGenerales, TO_PersonasMasVentas, TO_Producto, TO_ProductosMasVendidos, TO_Recargas } from 'src/app/models/tienda-online';
import readXlsxFile from 'read-excel-file';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-tienda-online',
    templateUrl: './tienda-online.component.html',
    styleUrls: ['./tienda-online.component.scss']
})
export class TiendaOnlineComponent implements OnInit {

    //Listas
    uploadedFiles: any[] = [];
    listTiendaOnline: TiendaOnline[] = [];
    listProductosMasVendidos: TO_ProductosMasVendidos[] = [];
    listPersonasMasVentas: TO_PersonasMasVentas[] = [];
    listComprasPorPersona: TO_ComprasPorPersona[] = [];
    listIndicadores: TO_IndicadoresGenerales[] = [];
    listProductos: TO_Producto[] = [];
    listRecargas: TO_Recargas[] = [];
    listDetalleRecargas: TO_DetalleRecarga[] = [];

    //Vista
    loading: boolean = false;
    archivosCargados: boolean = false;
    @ViewChild('tableVXP') tableVXP: Table;
    @ViewChild('tableVentasYProducto') tableVentasYProducto: Table;
    @ViewChild('tableProductos') tableProductos: Table;
    @ViewChild('tableVentasXPersona') tableVentasXPersona: Table;
    @ViewChild('tableRecargas') tableRecargas: Table;
    @ViewChild('tableDetalleRecargas') tableDetalleRecargas: Table;

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
                            fecha_transaccion: this.parsearFecha(element[1].replace(" | ", "T").replace(" ", "\/")),
                            usuario_cliente: element[2],
                            usuario_vendedor: element[3],
                            descripcion: element[4],
                            saldo: element[5],
                            saldo_adicional: Number(element[6].replace(/\$|\.|\+| |\-/g, '')),
                            saldo_total: element[7]
                        };
                        this.listTiendaOnline.push(tiendaOnlineObj);
                    });
                    this.getIndicadores();
                    this.getProductosMasVendidos();
                    this.getPersonasConMasVentas();
                    this.getProductos();
                    this.getRecargas();
                })
            });
            this.loading = false;
            this.archivosCargados = true;
        }, 100);
    }

    getIndicadores() {

        //Total Ventas
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        let cantidadVentas = listaVentas.length;
        let totalVentasDinero = listaVentas.reduce((a, curr) => a + curr.saldo_adicional, 0);
        this.listIndicadores.push({ nombre_indicador: 'Total Ventas', valor: totalVentasDinero + "", descripcion: ' Ventas en total', resaltado: cantidadVentas + "", icono: 'pi-shopping-cart', esMoneda: true });

        //Total Comisiones
        let listaComisiones = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Comision venta por'));
        let cantidadComisiones = listaComisiones.length;
        let totalComisionesDinero = listaComisiones.reduce((a, curr) => a + curr.saldo_adicional, 0);
        this.listIndicadores.push({ nombre_indicador: 'Total Comisiones', valor: totalComisionesDinero + "", descripcion: ' Comisiones en total', resaltado: cantidadComisiones + "", icono: 'pi-shopping-cart', esMoneda: true })

        //Total Recargas
        let listaRecargas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Recarga directa por el Administrador'));
        let cantidadRecargas = listaRecargas.length;
        let totalRecargasDinero = listaRecargas.reduce((a, curr) => a + curr.saldo_adicional, 0);
        this.listIndicadores.push({ nombre_indicador: 'Total Recargas', valor: totalRecargasDinero + "", descripcion: ' Recargas en total', resaltado: cantidadRecargas + "", icono: 'pi-shopping-cart', esMoneda: true })


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
        this.clear(this.tableVXP)
    }

    getPersonasConMasVentas() {
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas = listaVentas.map((movimiento) => {
            movimiento.producto = movimiento.descripcion.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();
            return movimiento;
        })
        listaVentas.forEach(element => {
            if (this.listPersonasMasVentas.length == 0) {
                this.listPersonasMasVentas.push({ nombre_persona: element.usuario_cliente, cantidad: 1 });
            }
            else {
                let encontrado = false;
                let contadorEncontrado = 0;
                for (let i = 0; i < this.listPersonasMasVentas.length; i++) {
                    const masVendidos = this.listPersonasMasVentas[i];
                    if (masVendidos.nombre_persona == element.usuario_cliente) {
                        encontrado = true;
                        contadorEncontrado = i;
                    }
                }
                if (!encontrado) {
                    this.listPersonasMasVentas.push({ nombre_persona: element.usuario_cliente, cantidad: 1 });
                }
                else {
                    this.listPersonasMasVentas[contadorEncontrado].cantidad = this.listPersonasMasVentas[contadorEncontrado].cantidad + 1;
                }
            }
        });
        this.listPersonasMasVentas.sort((a, b) => {
            if (a.cantidad < b.cantidad) {
                return 1;
            }
            if (a.cantidad > b.cantidad) {
                return -1;
            }
            return 0;
        });
        this.clear(this.tableVentasXPersona)
    }

    getComprasPorPersona(productoSeleccionado: string, personaSeleccionada: string) {
        this.listComprasPorPersona = [];
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas = listaVentas.map((movimiento) => {
            movimiento.producto = movimiento.descripcion.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();
            return movimiento;
        })
        if (productoSeleccionado != null) {
            listaVentas = listaVentas.filter((movimiento) => movimiento.producto == productoSeleccionado);
        }
        if (personaSeleccionada != null) {
            listaVentas = listaVentas.filter((movimiento) => movimiento.usuario_vendedor == personaSeleccionada);
        }
        listaVentas.forEach(element => {
            if (this.listComprasPorPersona.length == 0) {
                this.listComprasPorPersona.push({ nombre_producto: element.producto, cantidad_ventas: 1, valor_total: element.saldo_adicional, nombre_persona: element.usuario_cliente, valor_unitario: element.saldo_adicional });
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
                    this.listComprasPorPersona.push({ nombre_producto: element.producto, cantidad_ventas: 1, valor_total: element.saldo_adicional, nombre_persona: element.usuario_cliente, valor_unitario: element.saldo_adicional });
                }
                else {
                    this.listComprasPorPersona[contadorEncontrado].cantidad_ventas = this.listComprasPorPersona[contadorEncontrado].cantidad_ventas + 1;
                    this.listComprasPorPersona[contadorEncontrado].valor_total = this.listComprasPorPersona[contadorEncontrado].valor_total + element.saldo_adicional;
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
        this.clear(this.tableVentasYProducto);
    }

    getProductos() {
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas = listaVentas.map((movimiento) => {
            movimiento.producto = movimiento.descripcion.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();
            return movimiento;
        })
        listaVentas.forEach(element => {
            let existe = this.listProductos.filter((prod) => prod.nombre == element.producto);
            if (existe.length == 0) {
                this.listProductos.push({ nombre: element.producto, costo_unitario: 0 });
            }
        });
        this.clear(this.tableProductos);
    }

    getRecargas() {
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Recarga directa por el Administrador'));
        listaVentas.forEach(element => {
            this.listRecargas.push({ administrador: element.usuario_vendedor, cliente: element.usuario_cliente, valor_recarga: element.saldo_adicional, fecha_recarga: element.fecha_transaccion });
        });
        this.clear(this.tableRecargas);
    }

    getDetalleRecarga(recargaP: TO_Recargas) {
        this.listDetalleRecargas = [];
        let listaVentas = this.listTiendaOnline.filter((movimiento) => movimiento.descripcion.includes('Venta de Producto'));
        listaVentas = listaVentas.map((movimiento) => {
            movimiento.producto = movimiento.descripcion.split(';')[1].split('Venta de Producto')[1].split("id")[0].trim();
            return movimiento;
        })
        let listDetalleRecargasTemp = listaVentas.filter((recarga) => (recarga.usuario_cliente == recargaP.cliente) && (recarga.fecha_transaccion == recargaP.fecha_recarga)).map((movimiento) => {
            return {
                producto: movimiento.producto,
                persona: movimiento.usuario_vendedor,
                total_recarga: recargaP.valor_recarga,
                total_ventas: movimiento.saldo_adicional,
                balance: recargaP.valor_recarga - movimiento.saldo_adicional
            }
        })


        listDetalleRecargasTemp.forEach(element => {
            let existe = this.listDetalleRecargas.filter((prod) => prod.persona == element.persona);
            if (existe.length == 0) {
                this.listDetalleRecargas.push({ persona: element.persona, producto: element.producto, total_recarga: element.total_recarga, total_ventas: element.total_ventas, balance: element.total_recarga - element.total_ventas });
            }
            else {
                this.listDetalleRecargas.forEach(element2 => {
                    if (element2.persona == element.persona) {
                        element2.total_ventas += element.total_ventas;
                        element2.balance = element2.total_recarga - element2.total_ventas;
                    }
                });
            }
        });
        this.clear(this.tableDetalleRecargas);
    }


    clear(table: Table) {
        table.clear();
    }

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


}
