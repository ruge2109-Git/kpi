export interface MiEn_Movimientos{
    cod_movimientos?: string;
    id:string;
    movimiento:string;
    producto:string;
    descripcion:string;
    valor:number;
    saldo_anterior:number;
    nuevo_saldo:number;
    fecha:string;
    tipo:string;
}

export interface MIEn_Respuesta{
    cod_respuesta?: string;
    id:string;
    cuenta_afectada:string;
    password:string;
    resuelto:string;
    fecha_respuesta:string;
    respuesta:string;
}

export interface MIEn_Indicadores{
    fecha: string;
    ventas: number;
    cambio_cuenta: number;
    comision_venta: number;
    compra_saldo: number;
    comision_renovacion: number;
    renovacion: number;
    devolucion_renovacion: number;
    recepcion_saldo: number;
}
