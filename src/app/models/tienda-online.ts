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

export interface TO_ProductosMasVendidos {
    nombre_producto: string;
    cantidad: number;
}

export interface TO_PersonasMasVentas {
    nombre_persona: string;
    cantidad: number;
}

export interface TO_ComprasPorPersona {
    nombre_persona: string;
    nombre_producto: string;
    cantidad_ventas: number;
    valor_unitario: number;
    valor_total: number;
}

export interface TO_IndicadoresGenerales {
    nombre_indicador: string;
    icono: string;
    valor: string | number;
    descripcion: string;
    resaltado: string;
    esMoneda: boolean;
}

export interface TO_Producto {
    nombre: string;
    costo_unitario: number;
}

export interface TO_Recargas{
    administrador: string;
    cliente: string;
    valor_recarga: number;
    fecha_recarga: string;
}

export interface TO_DetalleRecarga{
    persona: string;
    producto: string;
    total_recarga: number;
    total_ventas: number;
    balance: number;
}
