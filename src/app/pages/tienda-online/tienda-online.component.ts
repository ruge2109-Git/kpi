import { TO_archivos } from './../../models/tienda-online';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TiendaOnline, TO_comisiones, TO_ComprasPorPersona, TO_DetalleRecarga, TO_IndicadoresGenerales, TO_PersonasMasVentas, TO_Producto, TO_ProductosMasVendidos, TO_Recargas } from 'src/app/models/tienda-online';
import readXlsxFile from 'read-excel-file';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { TiendaOnlineService } from 'src/app/service/tienda-online.service';
import { lastValueFrom } from 'rxjs';

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
    listComisiones: TO_comisiones[] = [];
    listArchivos: TO_archivos[] = [];

    //Totalizados
    totalRecargasRealizadas: number = 0;
    totalRecargas: number = 0;
    cantProdVendidos: number = 0;
    totalProdVendidos: number = 0;
    cantPersVendidos: number = 0;
    totalPersVendidos: number = 0;
    totalValorRecargaDetalle: number = 0;
    totalValorVentaRecargaDetalle: number = 0;
    totalBalanceRecargaDetalle: number = 0;
    cantVentasPerProd: number = 0;
    totalUnitarioPerProd: number = 0;
    totalGenePerProd: number = 0;
    totalCostPerProd: number = 0;
    totalUtilPerProd: number = 0;
    totalValorVentaDetalle: number = 0;
    totalCostoDetalle: number = 0;
    totalUtilidadDetalle: number = 0;
    compraPorPersonaSelected: TO_ComprasPorPersona;
    cantTotalComisiones: number = 0;
    //Vista
    @ViewChild('tableVXP') tableVXP: Table;
    @ViewChild('tableVentasYProducto') tableVentasYProducto: Table;
    @ViewChild('tableProductos') tableProductos: Table;
    @ViewChild('tableVentasXPersona') tableVentasXPersona: Table;
    @ViewChild('tableRecargas') tableRecargas: Table;
    @ViewChild('tableRecargasTotal') tableRecargasTotal: Table;
    @ViewChild('tableDetalleRecargas') tableDetalleRecargas: Table;
    @ViewChild('tableDetalleVenta') tableDetalleVenta: Table;
    @ViewChild('tableComisiones') tableComisiones: Table;

    @ViewChild('filterProd') filterProd: ElementRef;
    @ViewChild('filterVentasPersona') filterVentasPersona: ElementRef;


    //Filtros
    rangoFechasRecargas: Date[] = [];
    rangoFechas: Date[] = [];
    rangoFechasProductos: Date[] = [];
    rangoFechasPersona: Date[] = [];
    rangoFechasProdPerson: Date[] = [];
    rangoFechasDetalleVenta: Date[] = [];
    rangoFechasComisiones: Date[] = [];
    prodSelected: string = "";
    personSelectd: string = "";
    personComisiones: string = "";
    //Spiners
    spinIndicadores: boolean;
    spinProductos: boolean;
    spinRecargas: boolean;
    spinRecargasTotalizadas: boolean;
    spinDetalleRecarga: boolean;
    spinVentasProducto: boolean;
    spinTotalizadoVentas: boolean;
    spinVentaPersonaProducto: boolean;
    spinVentasPersona: boolean;
    spinDetalleVenta: boolean;
    spinComisiones: boolean;
    spinListaArchivos: boolean;

    //Modal
    display: boolean = false;
    recargaSeleccionada: TO_Recargas;
    fileSoporte: File;

    constructor(private messageService: MessageService, private tiendaService: TiendaOnlineService) { }

    ngOnInit(): void {
        this.getTiendaOnlineDatabase();
    }

    initData() {
        this.getIndicadores();
        this.getProductosMasVendidos();
        this.getPersonasConMasVentas();
        this.getRecargas();
        this.getRecargasTotalizado();
        this.getProductosDatabase();
    }

    onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
        this.readExcel();
    }

    getProductosDatabase() {
        this.spinProductos = true;
        this.tiendaService.getProductos().subscribe((data: any) => {
            this.spinProductos = false;
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
        this.tiendaService.getTiendaOnline().subscribe((data: any) => {
            if (!data.bRta) return;
            this.listTiendaOnline = data.data;
            this.initData();
        })
    }

    readExcel() {
        this.uploadedFiles.forEach(element => {
            readXlsxFile(element).then((rows) => {
                rows.forEach(async (element: any) => {
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
                        await this.saveMovimiento(tiendaOnlineObj, false);
                    }
                    if (descripcion == 'Venta de Producto') {
                        this.listProductos.push({ nombre: producto, costo_unitario: 0 });
                        await this.saveProducto({ nombre: producto, costo_unitario: 0 }, false);
                    }
                });
                this.initData();
            })
        });

    }

    getIndicadores() {
        this.listIndicadores = [];
        this.spinIndicadores = true;
        this.tiendaService.getIndicadores().subscribe((data: any) => {
            this.spinIndicadores = false;
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
        this.listProductosMasVendidos = [];
        this.spinVentasProducto = true;
        this.cantProdVendidos = 0;
        this.totalProdVendidos = 0;
        this.tiendaService.getVentasProducto().subscribe((data: any) => {
            this.spinVentasProducto = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado el top de productos' });
                return;
            }
            this.listProductosMasVendidos = data.data;
            this.listProductosMasVendidos.forEach(element => {
                element.total_venta = Number(element.total_venta);
                element.cantidad = Number(element.cantidad);
                this.cantProdVendidos += element.cantidad;
                this.totalProdVendidos += element.total_venta;
            });
        })
    }

    getProductosMasVendidosFiltro() {
        let fechaInicial = this.rangoFechasProductos[0] != null ? this.formatDate(this.rangoFechasProductos[0]) : null;
        let fechaFinal = this.rangoFechasProductos[1] != null ? this.formatDate(this.rangoFechasProductos[1]) : null;
        if (fechaInicial == null) {
            return;
        };
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listProductosMasVendidos = [];
        this.spinVentasProducto = true;
        this.cantProdVendidos = 0;
        this.totalProdVendidos = 0;
        this.tiendaService.getVentasProductoFiltro(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinVentasProducto = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado productos con el rango de fechas' });
                return;
            };
            this.listProductosMasVendidos = data.data;
            this.listProductosMasVendidos.forEach(element => {
                element.total_venta = Number(element.total_venta);
                element.cantidad = Number(element.cantidad);
                this.cantProdVendidos += element.cantidad;
                this.totalProdVendidos += element.total_venta;
            });
        })
    }

    getPersonasConMasVentas() {
        this.listPersonasMasVentas = [];
        this.spinVentasPersona = true;
        this.cantPersVendidos = 0;
        this.totalPersVendidos = 0;
        this.tiendaService.getVentasPersona().subscribe((data: any) => {
            this.spinVentasPersona = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado el top de ventas' });
                return;
            };
            this.listPersonasMasVentas = data.data;
            this.listPersonasMasVentas.forEach((element) => {
                element.total_venta = Number(element.total_venta);
                element.cantidad = Number(element.cantidad);
                this.cantPersVendidos += element.cantidad;
                this.totalPersVendidos += element.total_venta;
            })
        })
    }

    getPersonasConMasVentasFiltro() {
        let fechaInicial = this.rangoFechasPersona[0] != null ? this.formatDate(this.rangoFechasPersona[0]) : null;
        let fechaFinal = this.rangoFechasPersona[1] != null ? this.formatDate(this.rangoFechasPersona[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listPersonasMasVentas = [];
        this.spinVentasPersona = true;
        this.cantPersVendidos = 0;
        this.totalPersVendidos = 0;
        this.tiendaService.getVentasPersonaFiltro(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinVentasPersona = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado ventas con el rango de fechas' });
                return;
            };
            this.listPersonasMasVentas = data.data;
            this.listPersonasMasVentas.forEach((element) => {
                element.total_venta = Number(element.total_venta);
                element.cantidad = Number(element.cantidad);
                this.cantPersVendidos += element.cantidad;
                this.totalPersVendidos += element.total_venta;
            })
        })
    }

    getComprasPorPersona(productoSeleccionado: string, personaSeleccionada: string) {
        this.prodSelected = productoSeleccionado;
        this.personSelectd = personaSeleccionada;
        this.listVentasPorPersona = [];
        this.spinVentaPersonaProducto = true;
        this.cantVentasPerProd = 0;
        this.totalUnitarioPerProd = 0;
        this.totalGenePerProd = 0;
        this.totalCostPerProd = 0;
        this.totalUtilPerProd = 0;
        this.tiendaService.getVentasPorPersonaProducto(personaSeleccionada, productoSeleccionado).subscribe((data: any) => {
            this.spinVentaPersonaProducto = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado compras ' });
                return;
            };
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Información encontrada correctamente' });
            this.listVentasPorPersona = data.data;
            this.listVentasPorPersona.forEach(element => {
                element.cantidad_ventas = Number(element.cantidad_ventas);
                element.valor_unitario = Number(element.valor_unitario);
                element.valor_total = Number(element.valor_total);
                element.costo = Number(element.costo);
                element.utilidad = Number(element.utilidad);
                this.cantVentasPerProd += element.cantidad_ventas;
                this.totalUnitarioPerProd += element.valor_unitario;
                this.totalGenePerProd += element.valor_total;
                this.totalCostPerProd += element.costo;
                this.totalUtilPerProd += element.utilidad;
            });

        })
    }

    getComprasPorPersonaFiltro() {
        let fechaInicial = this.rangoFechasProdPerson[0] != null ? this.formatDate(this.rangoFechasProdPerson[0]) : null;
        let fechaFinal = this.rangoFechasProdPerson[1] != null ? this.formatDate(this.rangoFechasProdPerson[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listVentasPorPersona = [];
        this.spinVentaPersonaProducto = true;
        this.cantVentasPerProd = 0;
        this.totalUnitarioPerProd = 0;
        this.totalGenePerProd = 0;
        this.totalCostPerProd = 0;
        this.totalUtilPerProd = 0;
        this.tiendaService.getVentasPorPersonaProductoFiltro(this.personSelectd, this.prodSelected, fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinVentaPersonaProducto = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado compras ' });
                return;
            };
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Información encontrada correctamente' });
            this.listVentasPorPersona = data.data;
            this.listVentasPorPersona.forEach(element => {
                element.cantidad_ventas = Number(element.cantidad_ventas);
                element.valor_unitario = Number(element.valor_unitario);
                element.valor_total = Number(element.valor_total);
                element.costo = Number(element.costo);
                element.utilidad = Number(element.utilidad);
                this.cantVentasPerProd += element.cantidad_ventas;
                this.totalUnitarioPerProd += element.valor_unitario;
                this.totalGenePerProd += element.valor_total;
                this.totalCostPerProd += element.costo;
                this.totalUtilPerProd += element.utilidad;
            });

        })
    }

    getRecargas() {
        this.spinRecargas = true;
        this.totalRecargasRealizadas = 0;
        this.tiendaService.getRecargas().subscribe((data: any) => {
            this.spinRecargas = false;
            if (!data.bRta) return;
            this.listRecargas = data.data;
            this.listRecargas.forEach(element => {
                element.valor_recarga = Number(element.valor_recarga);
                this.totalRecargasRealizadas += Number(element.valor_recarga);
            });
        })
    }

    getRecargasTotalizado() {
        this.totalRecargas = 0;
        this.listRecargasTotalizados = [];
        this.spinRecargasTotalizadas = true;
        this.tiendaService.getRecargasTotalizado().subscribe((data: any) => {
            this.spinRecargasTotalizadas = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas' });
                return;
            };
            this.listRecargasTotalizados = data.data;
            this.listRecargasTotalizados.forEach(element => {
                element.valor_recarga = Number(element.valor_recarga);
                this.totalRecargas += Number(element.valor_recarga);
            });
        })
    }

    getRecargasPorFechas() {
        let fechaInicial = this.rangoFechasRecargas[0] != null ? this.formatDate(this.rangoFechasRecargas[0]) : null;
        let fechaFinal = this.rangoFechasRecargas[1] != null ? this.formatDate(this.rangoFechasRecargas[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.totalRecargasRealizadas = 0;
        this.listRecargas = [];
        this.tiendaService.getRecargasFiltro(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinRecargasTotalizadas = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango fechas indicadas' });
                return;
            };
            this.listRecargas = data.data;
            this.listRecargas.forEach(element => {
                element.valor_recarga = Number(element.valor_recarga);
                this.totalRecargasRealizadas += Number(element.valor_recarga);
            });
        })
    }

    getRecargasTotalizadoPorFechas() {
        this.totalRecargas = 0;
        let fechaInicial = this.rangoFechas[0] != null ? this.formatDate(this.rangoFechas[0]) : null;
        let fechaFinal = this.rangoFechas[1] != null ? this.formatDate(this.rangoFechas[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listRecargasTotalizados = [];
        this.tiendaService.getRecargasTotalizadoFiltro(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinRecargasTotalizadas = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado Recargas en el rango de fechas indicadas' });
                return;
            };
            this.listRecargasTotalizados = data.data;
            this.listRecargasTotalizados.forEach(element => {
                this.totalRecargas += Number(element.valor_recarga);
            });
        })

    }

    getDetalleRecarga(recargaP: TO_Recargas) {
        this.listDetalleRecargas = [];
        this.listComisiones = [];
        this.spinDetalleRecarga = true;
        this.totalValorRecargaDetalle = 0;
        this.totalValorVentaRecargaDetalle = 0;
        this.totalBalanceRecargaDetalle = 0;
        this.tiendaService.getDetalleRecarga(recargaP.cliente, recargaP.fecha_recarga).subscribe((data: any) => {
            this.spinDetalleRecarga = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han realizado transacciones ' });
                return;
            };
            this.listDetalleRecargas = data.data.map((data) => {
                this.totalValorRecargaDetalle += Number(data.recarga);
                this.totalValorVentaRecargaDetalle += Number(data.total_ventas);
                this.totalBalanceRecargaDetalle += Number(data.total_ventas);
                return {
                    persona: data.persona,
                    producto: data.producto,
                    total_recarga: Number(data.recarga),
                    total_ventas: Number(data.total_ventas),
                    balance: data.recarga - Number(data.total_ventas)
                }
            });
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Detalle encontrado' });
            this.clear(this.tableDetalleRecargas);
        })
        this.getComisiones(recargaP.cliente);
    }

    getComisiones(persona: string) {
        this.personComisiones = persona;
        this.tiendaService.getComisiones(persona).subscribe((data: any) => {
            this.spinComisiones = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado comisiones ' });
                return;
            };
            this.listComisiones = data.data;
            this.cantTotalComisiones = 0;
            this.listComisiones.forEach(element => {
                element.comisiones = Number(element.comisiones);
                this.cantTotalComisiones += element.comisiones;
            });
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Comisiones encontradas' });

        })
    }

    getComisionesPorFechas() {
        let fechaInicial = this.rangoFechasComisiones[0] != null ? this.formatDate(this.rangoFechasComisiones[0]) : null;
        let fechaFinal = this.rangoFechasComisiones[1] != null ? this.formatDate(this.rangoFechasComisiones[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.tiendaService.getComisionesFiltro(this.personComisiones, fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinComisiones = false;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'No se han encontrado comisiones ' });
                return;
            };
            this.listComisiones = data.data;
            this.cantTotalComisiones = 0;
            this.listComisiones.forEach(element => {
                element.comisiones = Number(element.comisiones);
                this.cantTotalComisiones += element.comisiones;
            });
        })
    }

    getDetalleVenta(compraPorPersona: TO_ComprasPorPersona) {
        this.compraPorPersonaSelected = compraPorPersona;
        this.listDetalleVenta = [];
        this.spinDetalleVenta = true;
        this.totalValorVentaDetalle = 0;
        this.totalCostoDetalle = 0;
        this.totalUtilidadDetalle = 0;
        this.tiendaService.getDetalleVenta(compraPorPersona.nombre_persona, compraPorPersona.nombre_producto).subscribe((data: any) => {
            this.spinDetalleVenta = false;
            if (!data.bRta) return;
            this.listDetalleVenta = data.data;
            this.listDetalleVenta.forEach(element => {
                element.valor_venta = Number(element.valor_venta);
                element.costo_producto = Number(element.costo_producto);
                element.utilidad = Number(element.utilidad);
                this.totalValorVentaDetalle += element.valor_venta;
                this.totalCostoDetalle += element.costo_producto;
                this.totalUtilidadDetalle += element.utilidad;
            });
        })
    }

    getDetalleVentaFiltro() {
        let fechaInicial = this.rangoFechasDetalleVenta[0] != null ? this.formatDate(this.rangoFechasDetalleVenta[0]) : null;
        let fechaFinal = this.rangoFechasDetalleVenta[1] != null ? this.formatDate(this.rangoFechasDetalleVenta[1]) : null;
        if (fechaInicial == null) return;
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.listDetalleVenta = [];
        this.spinDetalleVenta = true;
        this.totalValorVentaDetalle = 0;
        this.totalCostoDetalle = 0;
        this.totalUtilidadDetalle = 0;
        this.tiendaService.getDetalleVentaFiltro(this.compraPorPersonaSelected.nombre_persona, this.compraPorPersonaSelected.nombre_producto, fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinDetalleVenta = false;
            if (!data.bRta) return;
            this.listDetalleVenta = data.data;
            this.listDetalleVenta.forEach(element => {
                element.valor_venta = Number(element.valor_venta);
                element.costo_producto = Number(element.costo_producto);
                element.utilidad = Number(element.utilidad);
                this.totalValorVentaDetalle += element.valor_venta;
                this.totalCostoDetalle += element.costo_producto;
                this.totalUtilidadDetalle += element.utilidad;
            });
        })
    }


    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableProductos:
                this.filterProd.nativeElement.value = '';
                break;
            case this.tableRecargas:
                this.totalRecargasRealizadas = 0;
                this.getRecargas();
                this.rangoFechasRecargas = [];
                break;
            case this.tableVentasYProducto:
                this.getComprasPorPersona(this.prodSelected, this.personSelectd);
                this.rangoFechasProdPerson = [];
                break;
            case this.tableDetalleVenta:
                this.getDetalleVenta(this.compraPorPersonaSelected);
                this.rangoFechasDetalleVenta = [];
                break;
            case this.tableRecargasTotal:
                this.getRecargasTotalizado();
                this.rangoFechas = [];
                break;
            case this.tableVXP:
                this.getProductosMasVendidos();
                this.rangoFechasProductos = [];
                break;
            case this.tableVentasXPersona:
                this.getPersonasConMasVentas();
                this.rangoFechasPersona = [];
                break;
            case this.tableComisiones:
                this.getComisiones(this.personComisiones);
                this.rangoFechasComisiones = [];
                break;

            default:
                break;
        }
    }

    subirArchivoSoporte(files: any) {
        this.fileSoporte = files.currentFiles[0];
    }

    cambiarArchivo(fileUpload) {
        fileUpload.clear();
    }

    saveArchivo(formData) {
        const reader = new FileReader();
        reader.readAsDataURL(this.fileSoporte);
        reader.onload = () => {

            let nuevoArchivo: TO_archivos = {
                cod_tienda_streaming: this.recargaSeleccionada.cod_tienda_streaming,
                banco: formData.bancoT,
                cuenta: formData.cuentaT,
                valor: formData.valorT,
                numero_comprobante: formData.comprobante,
                fecha: this.formatDate(formData.calendarT),
                archivo: reader.result.toString(),
                nombre_archivo: this.fileSoporte.name,
                hora: formData.calendarT.getHours() + ":" + formData.calendarT.getMinutes()
            };
            this.tiendaService.sendArchivos(nuevoArchivo).subscribe((data) => {
                console.log(data);
            })
        };

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
        if (descripcionDB.includes('Recarga de saldo por el Administrador')) {
            return 'Recarga de saldo por el Administrador';
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

    async saveProducto(prod: TO_Producto, mostrar: boolean) {
        await lastValueFrom(this.tiendaService.newProducto(prod)).then((data: any) => {
            if (!mostrar) return;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'Ocurrio un error al intentar guardar el producto' });
                return;
            }
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se guardo el producto correctamente' });
        })
    }

    async saveMovimiento(tiendaOnline: TiendaOnline, mostrar: boolean) {
        const dateParts = tiendaOnline.fecha_transaccion.split("-");
        tiendaOnline.fecha_transaccion = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
        await lastValueFrom(this.tiendaService.newMovimientoTiendaOnline(tiendaOnline)).then((data: any) => {
            if (!mostrar) return;
            if (!data.bRta) {
                this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'Ocurrio un error al intentar guardar el movimiento' });
                return;
            }
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se guardo el movimiento correctamente' });
        })
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

    filtroRecargas(filtro: string, columna: String) {
        this.totalRecargasRealizadas = 0;
        this.listRecargas.forEach(element => {
            if (element[`${columna}`].toLowerCase().includes(filtro.toLowerCase())) {
                this.totalRecargasRealizadas += Number(element.valor_recarga);
            }
            if (columna == 'valor_recarga') {
                if (Number(element[`${columna}`]) == Number(filtro)) {
                    this.totalRecargasRealizadas += Number(element.valor_recarga);
                }
            }
        });
    }

    filtroProductos(filtro: string, columna: String) {
        this.totalProdVendidos = 0;
        this.cantProdVendidos = 0;
        this.listProductosMasVendidos.forEach(element => {
            if (element[`${columna}`].toLowerCase().includes(filtro.toLowerCase())) {
                this.totalProdVendidos += Number(element.total_venta);
                this.cantProdVendidos += Number(element.cantidad);
            }
        });
    }

    filtroPersona(filtro: string, columna: String) {
        this.totalPersVendidos = 0;
        this.cantPersVendidos = 0;
        this.listPersonasMasVentas.forEach(element => {
            if (element[`${columna}`].includes(filtro)) {
                this.totalPersVendidos += Number(element.total_venta);
                this.cantPersVendidos += Number(element.cantidad);
            }
        });
    }

    filtroProdPerson(filtro: string, columna: String) {
        this.cantVentasPerProd = 0;
        this.totalUnitarioPerProd = 0;
        this.totalGenePerProd = 0;
        this.totalCostPerProd = 0;
        this.totalUtilPerProd = 0;
        this.listVentasPorPersona.forEach(element => {
            if (element[`${columna}`].toLowerCase().includes(filtro.toLowerCase())) {
                element.cantidad_ventas = Number(element.cantidad_ventas);
                element.valor_unitario = Number(element.valor_unitario);
                element.valor_total = Number(element.valor_total);
                element.costo = Number(element.costo);
                element.utilidad = Number(element.utilidad);
                this.cantVentasPerProd += element.cantidad_ventas;
                this.totalUnitarioPerProd += element.valor_unitario;
                this.totalGenePerProd += element.valor_total;
                this.totalCostPerProd += element.costo;
                this.totalUtilPerProd += element.utilidad;
            }
        });
    }

    filtroDetalleVenta(filtro: string, columna: String) {
        this.totalValorVentaDetalle = 0;
        this.totalCostoDetalle = 0;
        this.totalUtilidadDetalle = 0;
        this.listDetalleVenta.forEach(element => {
            if (element[`${columna}`].toLowerCase().includes(filtro.toLowerCase())) {
                element.valor_venta = Number(element.valor_venta);
                element.costo_producto = Number(element.costo_producto);
                element.utilidad = Number(element.utilidad);
                this.totalValorVentaDetalle += element.valor_venta;
                this.totalCostoDetalle += element.costo_producto;
                this.totalUtilidadDetalle += element.utilidad;
            }
        });
    }

    filtroComisiones(filtro: string, columna: String) {
        this.cantTotalComisiones = 0;
        this.listComisiones.forEach(element => {
            if (element[`${columna}`].toLowerCase().includes(filtro.toLowerCase())) {
                element.comisiones = Number(element.comisiones);
                this.cantTotalComisiones += element.comisiones;
            }
        });
    }

    verArchivosRecarga(recargaSeleccionada: TO_Recargas) {
        this.listArchivos = [];
        this.recargaSeleccionada = recargaSeleccionada;



        this.display = true;
    }



}
