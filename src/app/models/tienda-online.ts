export interface TiendaOnline {
    cod_tienda_streaming?: number;
    fecha_transaccion: string;
    usuario_cliente: string;
    usuario_vendedor: string;
    descripcion: string;
    producto?: string;
    id_transaccion?: string;
    valor_venta: number;
    saldo: number;
    saldo_adicional: number;
    saldo_total: number;
    costo_producto?: number;
    utilidad?: number;
}

export interface TO_ProductosMasVendidos {
    nombre_producto: string;
    cantidad: number;
    fecha_transaccion: string;
    total_venta: number;
}

export interface TO_PersonasMasVentas {
    nombre_persona: string;
    cantidad: number;
    fecha_transaccion: string;
    total_venta: number;
}

export interface TO_ComprasPorPersona {
    nombre_persona: string;
    nombre_producto: string;
    fecha_transaccion: string;
    cantidad_ventas: number;
    valor_unitario: number;
    valor_total: number;
    costo: number;
    utilidad: number;
}

export interface TO_IndicadoresGenerales {
    nombre_indicador: string;
    icono: string;
    valor: number;
    descripcion: string;
    resaltado: string;
    esMoneda: boolean;
}

export interface TO_Producto {
    cod_producto?: number;
    nombre: string;
    costo_unitario: number;
}

export interface TO_Recargas {
    cod_tienda_streaming: number;
    administrador: string;
    cliente: string;
    valor_recarga: number;
    fecha_recarga: string;
}

export interface TO_DetalleRecarga {
    persona: string;
    producto: string;
    total_recarga: number;
    total_ventas: number;
    balance: number;
}

export interface TO_comisiones {
    usuario_vendedor: string;
    producto: string;
    fecha_transaccion: string;
    comisiones: number;
}

export interface TO_archivos {
    cod_transaccion?: number;
    cod_tienda_streaming: number;
    banco: string;
    cuenta: string;
    valor: number;
    fecha: string;
    hora: string;
    numero_comprobante: string;
    archivo: string;
    nombre_archivo: string;
}
