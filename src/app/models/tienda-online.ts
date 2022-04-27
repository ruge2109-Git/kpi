export interface TiendaOnline {
    cod_tienda_streaming: number;
    fecha_transaccion: string;
    usuario_cliente: string;
    usuario_vendedor: string;
    descripcion: string;
    producto?: string;
    id_transaccion?: string;
    valor_venta?: number;
    saldo: number;
    saldo_adicional: number;
    saldo_total: number;
}

export interface TO_ProductosMasVendidos{
    nombre_producto: string;
    cantidad: number;
}

export interface TO_ComprasPorPersona{
    nombre_persona: string;
    nombre_producto: string;
    cantidad_ventas: number;
    total_vendido: number;
}
