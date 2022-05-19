export interface EXR_Extracto_recargas {
    fecha: string;
    hora: string;
    descripcion: string;
    servicio: string;
    saldo_anterior: number;
    valor: number;
    saldo_final: number;
    usuario: string;
    cliente_responsable: string;
    cliente_afectado: string;
}

export interface EXR_Indicadores{
    fecha: string;
    cliente_compra: string;
    cliente_reparto: string;
    valor_compra: number;
    valor_reparto: number;
    comision: number;
}
